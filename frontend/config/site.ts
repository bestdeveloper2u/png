const isServer = typeof window === "undefined";

const resolveSiteUrl = () => {
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
    if (!isServer && typeof window !== "undefined") return window.location.origin;
    return "http://localhost:5000";
};

const SITE_URL = resolveSiteUrl();

const resolveApiUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (!isServer && typeof window !== "undefined") return `${window.location.origin}/api/v1`;
    return `${SITE_URL}/api/v1`;
};

const API_URL = resolveApiUrl();

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || SITE_URL;
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || "http://127.0.0.1:8000/api/v1";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "PNGPoint";

export const siteConfig = {
    url: SITE_URL,
    apiUrl: isServer ? INTERNAL_API_URL : API_URL,
    mediaUrl: MEDIA_URL,
    name: SITE_NAME,
    siteName: SITE_NAME,
    title: process.env.NEXT_PUBLIC_SITE_TITLE || `Download Free PNG Images with Transparent Background | ${SITE_NAME}`,
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Explore thousands of free PNG images with transparent backgrounds. Perfect for presentations, graphic design, and social media posts",
    ogImage: `${SITE_URL}/og-image.png`,
    licenseUrl: `${SITE_URL}/license`,
    copyright: `© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`,
    twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "",
};

export const getImageUrl = (slug: string) => `${siteConfig.url}/image/${slug}`;
export const getSubCategoryUrl = (slug: string) => `${siteConfig.url}/sub-categories/${slug}`;
export const getSearchUrl = (title: string) => `${siteConfig.url}/?title=${encodeURIComponent(title)}`;

export const getSiteHostname = () => {
    try {
        return new URL(siteConfig.url).hostname;
    } catch {
        return "localhost";
    }
};
