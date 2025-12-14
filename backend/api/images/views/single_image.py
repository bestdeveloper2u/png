from django.db.models import Prefetch
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from images.models import Images
from api.images.serializers.single_image import SingleImageSerializer
from images.services.cloudflare import (
    GET_SINGLE_IMAGE_URL_FROM_CLOUDFLARE,
    GET_SINGLE_MAIN_IMAGE_URL_FROM_CLOUDFLARE,
)
from core.utils import GENERATE_SLUG
from api.throttling import PublicEndpointThrottle, BurstRateThrottle, SustainedRateThrottle

class SingleImageView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    renderer_classes = [JSONRenderer]
    throttle_classes = [PublicEndpointThrottle, BurstRateThrottle, SustainedRateThrottle]

    def retrieve(self, request, slug=None):
        # ---------------- MAIN IMAGE ----------------
        image = Images.objects.select_related(
            'user', 'category', 'sub_category'
        ).prefetch_related("keywords").filter(slug=slug).first()
        if not image:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        # ---------------- MAIN IMAGE KEYWORDS ----------------
        main_keywords = list(image.keywords.all().order_by("id"))
        if not main_keywords:
            return Response(
                {
                    "count": 0,
                    "results": [],
                    "image": SingleImageSerializer(image).data,
                    "success": True,
                    "message": "No keywords found for this image.",
                },
                status=status.HTTP_200_OK,
            )

        first_kw = main_keywords[0]
        first_kw_slug = first_kw.slug
        print(f"Main image first keyword: {first_kw.name} ({first_kw_slug})")

        # ---------------- RELATED IMAGES (first keyword match) ----------------
        related_qs = (
            Images.objects.filter(keywords__slug=first_kw_slug)
            .exclude(pk=image.pk)
            .prefetch_related("keywords")
            .distinct()
            .order_by("-created_at")
        )

        related_list = []
        for img in related_qs:
            img_keywords = list(img.keywords.all().order_by("id"))
            if img_keywords and img_keywords[0].slug == first_kw_slug:
                related_list.append(img)

        # limit to 50
        related_list = related_list[:50]

        # ---------------- OPTIONAL SEARCH / KEYWORD FILTERS (OR) ----------------
        search_term = request.GET.get("search")
        keyword_term = request.GET.get("keyword")

        if search_term or keyword_term:
            slugs_to_match = []
            if search_term:
                slugs_to_match.append(GENERATE_SLUG(search_term))
            if keyword_term:
                slugs_to_match.append(GENERATE_SLUG(keyword_term))

            # keep images if any keyword slug matches any of the slugs
            related_list = [
                img for img in related_list
                if any(kw.slug in slugs_to_match for kw in img.keywords.all())
            ]

        # ---------------- SERIALIZE ----------------
        related_serializer = SingleImageSerializer(related_list, many=True)
        main_image_data = SingleImageSerializer(image).data

        # ---------------- CLOUDFLARE URLS ----------------
        if image.cloudflare_id:
            cf_url = GET_SINGLE_IMAGE_URL_FROM_CLOUDFLARE(image.cloudflare_id)
            main_url = GET_SINGLE_MAIN_IMAGE_URL_FROM_CLOUDFLARE(image.cloudflare_id)
            main_image_data["cloudflare_url"] = cf_url
            main_image_data["url"] = cf_url
            main_image_data["main_url"] = main_url

        # ---------------- RESPONSE ----------------
        response_data = {
            "count": len(related_serializer.data),
            "results": related_serializer.data,
            "image": main_image_data,
            "success": True,
            "message": "Image with related images (based on first keyword and optional search/keyword) fetched successfully.",
        }

        return Response(response_data, status=status.HTTP_200_OK)
