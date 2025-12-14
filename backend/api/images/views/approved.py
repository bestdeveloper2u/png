from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from django_filters.rest_framework import DjangoFilterBackend
from permissions.admin import IsAdminUser
from permissions.user import IsRegularUser
from images.models import Images
from rest_framework.permissions import AllowAny
from api.images.serializers.approved import ApprovedImagesSerializer
from images.filters.filters import ImageFilterKeyword
from images.pagination.pagination import ImagesPagination
from api.decorators import cache_api_response
from api.throttling import BurstRateThrottle, SustainedRateThrottle, PublicEndpointThrottle

class ApprovedImagesViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    renderer_classes = [JSONRenderer]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ImageFilterKeyword
    pagination_class = ImagesPagination
    throttle_classes = [PublicEndpointThrottle, BurstRateThrottle, SustainedRateThrottle]

    @cache_api_response(timeout=300, cache_key_prefix="approved_images")
    def list(self, request, *args, **kwargs):
        """
        Serve the approved images from the cache.
        If not cached, set it to cache using DB query + paginate.
        """
        
        queryset = Images.objects.filter(status="approved").select_related(
            'user', 'category', 'sub_category'
        ).prefetch_related('keywords').order_by("-created_at")

        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(request, queryset, self)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)
        serializer = ApprovedImagesSerializer(page, many=True)
        response = paginator.get_paginated_response(serializer.data)
        return response

class ApprovedImagesLenghtView(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        approved_length = Images.objects.filter(status='approved').count()
        return Response({
            'success': True,
            'message': 'Approved images length fetched successfully.',
            'images_length': approved_length,
        }, status=status.HTTP_200_OK)

class UserApprovedImagesViewSet(viewsets.ViewSet):
    permission_classes = [IsRegularUser]
    renderer_classes = [JSONRenderer]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ImageFilterKeyword
    pagination_class = ImagesPagination

    def list(self, request, *args, **kwargs):
        """
        Serve the approved images from the cache.
        If not cached, set it to cache using DB query + paginate.
        """
        user = request.user

        queryset = Images.objects.filter(user=user, status='approved').select_related(
            'user', 'category', 'sub_category'
        ).prefetch_related('keywords').order_by('-created_at')

        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(request, queryset, self)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)
        serializer = ApprovedImagesSerializer(page, many=True)
        response = paginator.get_paginated_response(serializer.data)
        return response
    
class UserApprovedImagesLengthView(viewsets.ViewSet):
    permission_classes = [IsRegularUser]
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        user = request.user
        approved_length = Images.objects.filter(user=user, status='approved').count()

        return Response({
            'success': True,
            'message': 'User approved images count fetched successfully.',
            'images_length': approved_length,
        }, status=status.HTTP_200_OK)
