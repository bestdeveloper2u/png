from django.core.cache import cache
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from django_filters.rest_framework import DjangoFilterBackend
from permissions.admin import IsAdminUser
from permissions.user import IsRegularUser
from images.models import Images
from api.images.serializers.pending import PendingImagesSerializer
from images.filters.filters import ImageFilter
from images.pagination.pagination import ImagesPagination

class PendingImagesViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ImageFilter
    pagination_class = ImagesPagination

    def list(self, request, *args, **kwargs):
        """
        Serve the pending images from the cache.
        If not cached, set it to cache using DB query + paginate.
        """
        
        queryset = Images.objects.filter(status='pending').select_related(
            'user', 'category', 'sub_category'
        ).prefetch_related('keywords').order_by('-created_at')

        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(request, queryset, self)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)
        serializer = PendingImagesSerializer(page, many=True)
        response = paginator.get_paginated_response(serializer.data)
        return response
    
class PendingImagesLenghtView(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        pending_length = Images.objects.filter(status='pending').count()
        return Response({
            'success': True,
            'message': 'Pending images length fetched successfully.',
            'images_length': pending_length,
        }, status=status.HTTP_200_OK)
    
class UserPendingImagesViewSet(viewsets.ViewSet):
    permission_classes = [IsRegularUser]
    renderer_classes = [JSONRenderer]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ImageFilter
    pagination_class = ImagesPagination

    def list(self, request, *args, **kwargs):
        """
        Serve the pending images from the cache.
        If not cached, set it to cache using DB query + paginate.
        """
  
        user = request.user
        queryset = Images.objects.filter(user=user, status='pending').select_related(
            'user', 'category', 'sub_category'
        ).prefetch_related('keywords').order_by('-created_at')

        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(request, queryset, self)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)
        serializer = PendingImagesSerializer(page, many=True)
        response = paginator.get_paginated_response(serializer.data)
        return response

class UserPendingImagesLengthView(viewsets.ViewSet):
    permission_classes = [IsRegularUser]
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        user = request.user
        approved_length = Images.objects.filter(user=user, status='pending').count()

        return Response({
            'success': True,
            'message': 'User pending images count fetched successfully.',
            'images_length': approved_length,
        }, status=status.HTTP_200_OK)
