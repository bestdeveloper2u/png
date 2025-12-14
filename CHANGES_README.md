# PNGPoint Update Notes

This document summarizes the code changes introduced during the latest round of hardening and upgrades. Each section lists what changed and why it was necessary.

---

## Backend

### `backend/app/settings/base.py`
- **Lines 22–36:** New environment-driven constants (`CACHE_DEFAULT_TIMEOUT`, `FRONTEND_DOMAIN`, `DEFAULT_CORS_ORIGINS`, `IMAGE_UPLOAD_ALLOWED_EXTENSIONS`) replace hard-coded literals so deployments configure limits without editing code.
- **Lines 123–133:** `REST_FRAMEWORK` now sets `DEFAULT_PERMISSION_CLASSES` to `IsAuthenticatedOrReadOnly` and reduces the default page size from `10_000_000` to an env-driven `100`, preventing anonymous writes and runaway queries.
- **Lines 135–142:** Replaced `CORS_ALLOW_ALL_ORIGINS=True` with explicit allowlists and added `CSRF_TRUSTED_ORIGINS` to stop arbitrary origins from sending authenticated requests.
- **Lines 144–162:** `SIMPLE_JWT` now reads the signing key from env and sets short, overridable token lifetimes instead of shipping year-long tokens.
- **Lines 172–178, 182–189:** SMTP, Next.js, and cache configuration all come from env vars; the revalidation secret is no longer hardcoded in source control.

### `backend/app/settings/prod.py`
- **Lines 1–34:** Production now simply imports `base.py` defaults; previously the file reintroduced 365-day JWT lifetimes. Removing that override ensures prod inherits the short lifetimes configured above.

### `backend/core/utils.py`
- **Lines 17–55:** Consolidated the duplicate `VALIDATE_IMAGE_EXTENSION` helper and tied its allowlist to `settings.IMAGE_UPLOAD_ALLOWED_EXTENSIONS`, so admins can change allowed types per env.
- **Lines 88–111:** `trigger_nextjs_revalidate` now verifies `NEXTJS_URL` and `REVALIDATE_SECRET` exist, logs failures instead of throwing, and trims trailing slashes to avoid malformed URLs.

### `backend/api/images/views/upload.py`
- **Lines 47–142:** Added `IsAuthenticated` permission, validation of every uploaded file (extension, size, dimensions), rewound file handles before sending to Cloudflare, wrapped DB writes in `transaction.atomic()`, and reworked keyword creation to deduplicate slugs. This prevents anonymous abuse, oversized files, and duplicate keyword rows.

### `backend/images/services/cloudflare.py`
- **Line 12:** Expanded `ALLOWED_VARIANTS` to include `singleimage` and `singleimagemain`, matching the helper functions so URL builders no longer reference variants outside the allowlist.

---

## Frontend

### Dependency & tooling upgrades
- **Files:** `frontend/package.json:12-45`, `frontend/package-lock.json`, `frontend/eslint.config.mjs:1-28`
- **Change:** Upgraded Next.js/React/Tailwind/etc. to their latest releases (closing the reported Next.js vulnerability), removed unused `next-auth`, and replaced the compat shim with `eslint-config-next` directly. This keeps tooling compatible with Next 16 and React 19 while preventing future `FlatCompat` errors.

### `frontend/next.config.ts`
- **Lines 3–50:** Added a strict Content-Security-Policy, Referrer-Policy, X-Frame-Options, and Permissions-Policy headers so every response ships with basic hardening by default.

### Runtime env handling
- **`frontend/utils/api.ts:1-2`:** SERVER/MEDIA URLs now come from `NEXT_PUBLIC_*` env vars instead of hard-coded production strings.
- **`frontend/app/api/revalidate/route.ts:1-35`:** The API route reads `process.env.REVALIDATE_SECRET`, refuses to run when it’s missing, validates the incoming payload, and defaults to `/` when `path` isn’t a string.

### Fetch resiliency
- **`frontend/utils/getFetchData.ts:1-26`:** Centralized fetch helper now wraps requests in `try/catch`, adds JSON `Accept` headers, and reports HTTP errors with status text.
- **`frontend/app/page.tsx:6-46` & `frontend/components/homepageMainComponent/homepageMainComponent.tsx:24-92`:** Server and client fetching both log failures and continue rendering fallback UI instead of crashing when the API is unreachable, and the client-side router push no longer runs with invalid URLs.

### Client authentication state
- **`frontend/redux/features/auth/authSlice.ts:4-44`:** Tokens and user payload now hydrate from `sessionStorage` scoped to the current tab, reducing risk if a machine is shared and preventing indefinite persistence.
- **`frontend/redux/features/api/apiSlice.ts:8-105`:** Added `clearSessionAuth()` whenever refresh fails or tokens go missing, so stale sessions are purged consistently.

---

## Documentation

### `README.md`
- **Lines 117–139:** Environment variable table now documents the new backend knobs (`CORS_ALLOWED_ORIGINS`, JWT lifetime overrides, cache TTL, image extension allowlist) and clarifies that frontend URLs should come from `.env.local`.

---

## Support Files

### `CHANGES_README.md`
- **Lines 1–77:** This document was added to give you a line-by-line rationale for every change above so future maintainers can trace why code was added or removed.

---

## Notes
- Run `npm install` in `frontend/` to ensure dependencies match the updated lockfile.
- Remember to set the new backend env vars (`FRONTEND_DOMAIN`, `CORS_ALLOWED_ORIGINS`, `ACCESS_TOKEN_LIFETIME_MINUTES`, etc.) in every environment before deploying.
