import logging
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

from images.models import SubCategories
from permissions.admin import IsAdminUser
from core.utils import success_response, error_response
from api.images.serializers.sub_categories import (
    SubCategoriesSerializers,
    CreateSubCategoriesSerializer,
)
from images.filters.filters import SubCategoriesFilter
from api.decorators import cache_api_response, invalidate_cache_prefix
from api.throttling import PublicEndpointThrottle, BurstRateThrottle, SustainedRateThrottle

logger = logging.getLogger(__name__)

class SubCategoriesPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 200

class SubCategoriesViewSet(viewsets.ViewSet):
    filter_backends = [DjangoFilterBackend]
    filterset_class = SubCategoriesFilter
    pagination_class = SubCategoriesPagination
    throttle_classes = [PublicEndpointThrottle, BurstRateThrottle, SustainedRateThrottle]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def _invalidate_cache(self):
        invalidate_cache_prefix("sub_categories")
        invalidate_cache_prefix("sub_category_detail")
        invalidate_cache_prefix("categories")
        invalidate_cache_prefix("category_detail")

    @cache_api_response(timeout=600, cache_key_prefix="sub_categories")
    def list(self, request):
        try:
            queryset = SubCategories.objects.select_related('categories').order_by('name')
            for backend in self.filter_backends:
                queryset = backend().filter_queryset(request, queryset, self)
            serializer = SubCategoriesSerializers(queryset, many=True)
            return success_response("Sub Categories retrieved successfully.", serializer.data)
        except Exception as e:
            logger.error(f"Failed to retrieve sub categories: {e}", exc_info=True)
            return error_response(
                message="Failed to retrieve sub categories. Please try again later.",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @cache_api_response(timeout=600, cache_key_prefix="sub_category_detail")
    def retrieve(self, request, slug=None):
        try:
            sub_category = get_object_or_404(SubCategories.objects.select_related("categories"), slug=slug)
            images_queryset = sub_category.images.only(
                "id", "title", "slug", "cloudflare_url", "created_at"
            ).order_by("-id")

            paginator = self.pagination_class()
            paginated_images = paginator.paginate_queryset(images_queryset, request)

            images_data = [
                {
                    "id": image.id,
                    "title": image.title,
                    "slug": image.slug,
                    "cloudflare_url": image.cloudflare_url,
                    "created_at": image.created_at,
                }
                for image in paginated_images
            ]

            response_data = {
                "id": sub_category.id,
                "icon": sub_category.icon.url if sub_category.icon else None,
                "name": sub_category.name,
                "slug": sub_category.slug,
                "categories": {
                    "id": sub_category.categories.id if sub_category.categories else None,
                    "icon": sub_category.categories.icon.url if sub_category.categories and sub_category.categories.icon else None,
                    "name": sub_category.categories.name if sub_category.categories else None,
                    "slug": sub_category.categories.slug if sub_category.categories else None,
                },
                "images": images_data,
            }

            return paginator.get_paginated_response(response_data)

        except Exception as e:
            logger.error(f"Failed to retrieve sub category '{slug}': {e}", exc_info=True)
            return error_response(
                message="Failed to retrieve sub category. Please try again later.",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request):
        try:
            serializer = CreateSubCategoriesSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                self._invalidate_cache()
                return success_response(
                    message="Sub category created successfully.",
                    data=serializer.data,
                )
            return error_response(
                message="Validation errors occurred.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(f"Failed to create sub category: {e}", exc_info=True)
            return error_response(
                message="Failed to create sub category. Please try again later.",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update(self, request, pk=None):
        try:
            sub_category = get_object_or_404(SubCategories, pk=pk)
            serializer = SubCategoriesSerializers(sub_category, data=request.data)
            if serializer.is_valid():
                serializer.save()
                self._invalidate_cache()
                return success_response(
                    message="Sub category updated successfully.",
                    data=serializer.data,
                )
            return error_response(
                message="Validation errors occurred.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(f"Failed to update sub category {pk}: {e}", exc_info=True)
            return error_response(
                message="Failed to update sub category. Please try again later.",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def partial_update(self, request, pk=None):
        try:
            sub_category = get_object_or_404(SubCategories, pk=pk)
            serializer = SubCategoriesSerializers(sub_category, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                self._invalidate_cache()
                return success_response(
                    message="Sub category partially updated successfully.",
                    data=serializer.data,
                )
            return error_response(
                message="Validation errors occurred.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(f"Failed to partially update sub category {pk}: {e}", exc_info=True)
            return error_response(
                message="Failed to partially update sub category. Please try again later.",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def destroy(self, request, pk=None):
        try:
            sub_category = get_object_or_404(SubCategories, pk=pk)
            sub_category.delete()
            self._invalidate_cache()
            return success_response(
                message="Sub category deleted successfully.",
            )
        except Exception as e:
            logger.error(f"Failed to delete sub category {pk}: {e}", exc_info=True)
            return error_response(
                message="Failed to delete sub category. Please try again later.",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
