import logging
from django.http import Http404
from rest_framework import viewsets, status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend

from images.models import Categories
from permissions.admin import IsAdminUser
from core.utils import success_response, error_response
from api.images.serializers.categories import CategoriesSerializer,CreateCategoriesSerializer,SingleCategoriesSerializer
from images.filters.filters import CategoriesFilter
from api.decorators import cache_api_response, invalidate_cache_prefix
from api.throttling import PublicEndpointThrottle, BurstRateThrottle, SustainedRateThrottle

logger = logging.getLogger(__name__)

class CategoriesViewSet(viewsets.ViewSet):
    filter_backends = [DjangoFilterBackend]
    filterset_class = CategoriesFilter
    throttle_classes = [PublicEndpointThrottle, BurstRateThrottle, SustainedRateThrottle]

    """
    CategoriesViewSet handles all CRUD operations for Categories model.

    Permissions:
        - list, retrieve: accessible by all users
        - create, update, partial_update, destroy: admin only
    """
    
    # -------------------- Permissions --------------------
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def _invalidate_cache(self):
        invalidate_cache_prefix("categories")
        invalidate_cache_prefix("category_detail")
        invalidate_cache_prefix("sub_categories")
        invalidate_cache_prefix("sub_category_detail")

    # -------------------- List --------------------
    @cache_api_response(timeout=600, cache_key_prefix="categories")
    def list(self, request):
        """GET all categories (accessible by all users)."""
        try:
            queryset = Categories.objects.prefetch_related(
                'sub_categories'
            ).only(
                "id", 
                "icon", 
                "name", 
                "slug",
            ).order_by("name")
            
            for backend in list(self.filter_backends):
                queryset = backend().filter_queryset(self.request, queryset, self)

            serializer = CategoriesSerializer(queryset, many=True)
            return success_response("Categories retrieved successfully.", serializer.data)

        except Exception as e:
            logger.error(f"Failed to retrieve categories: {e}", exc_info=True)
            return error_response(
                message="Failed to retrieve categories. Please try again later.",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # -------------------- Retrieve --------------------
    @cache_api_response(timeout=600, cache_key_prefix="category_detail")
    def retrieve(self, request, slug=None):
        """GET single category by slug (accessible by all users)."""
        try:
            category = get_object_or_404(
                Categories.objects.prefetch_related('sub_categories'),
                slug=slug
            )
            serializer = SingleCategoriesSerializer(category)
            return success_response(
                message="Category retrieved successfully.",
                data=serializer.data,
            )
        except Http404:
            return error_response(
                message="Category not found.",
                errors="Invalid category id.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            logger.error(f"Failed to retrieve category {slug}: {e}", exc_info=True)
            return error_response(
                message="Failed to retrieve category. Please try again later.",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # -------------------- Create --------------------
    def create(self, request):
        """POST → Create a new category (admin only)."""
        try:
            serializer = CreateCategoriesSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                self._invalidate_cache()
                return success_response(
                    message="Category created successfully",
                    data=serializer.data,
                    status_code=status.HTTP_201_CREATED,
                )
            return error_response(
                message="Validation errors",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(f"Failed to create category: {e}", exc_info=True)
            return error_response(
                message="Failed to create category. Please try again later.",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # -------------------- Update --------------------
    def update(self, request, pk=None):
        """PUT → update all fields (admin only)."""
        try:
            category = get_object_or_404(Categories, pk=pk)
            serializer = CategoriesSerializer(category, data=request.data)
            if serializer.is_valid():
                serializer.save()
                self._invalidate_cache()

                return success_response(
                    message="Category updated successfully.",
                    data=serializer.data,
                )
            return error_response(
                message="Validation errors occurred.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(f"Failed to update category {pk}: {e}", exc_info=True)
            return error_response(
                message="Failed to update category. Please try again later.",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # -------------------- Partial Update --------------------
    def partial_update(self, request, pk=None):
        """PATCH → update selected fields (admin only)."""
        try:
            category = get_object_or_404(Categories, pk=pk)
            serializer = CategoriesSerializer(category, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                self._invalidate_cache()

                return success_response(
                    message="Category partially updated successfully.",
                    data=serializer.data,
                )
            return error_response(
                message="Validation errors occurred.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(f"Failed to partially update category {pk}: {e}", exc_info=True)
            return error_response(
                message="Failed to partially update category. Please try again later.",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # -------------------- Destroy --------------------
    def destroy(self, request, pk=None):
        """DELETE → remove a category (admin only)."""
        try:
            category = get_object_or_404(Categories, pk=pk)
            category.delete()
            self._invalidate_cache()
            return success_response(message="Category deleted successfully.")
        except Exception as e:
            logger.error(f"Failed to delete category {pk}: {e}", exc_info=True)
            return error_response(
                message="Failed to delete category. Please try again later.",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
