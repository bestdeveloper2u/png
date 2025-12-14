from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from django_filters.rest_framework import DjangoFilterBackend
from permissions.admin import IsAdminUser
from permissions.user import IsRegularUser
from images.models import Images
from api.images.serializers.rejected import RejectedImagesSerializer
from images.filters.filters import ImageFilter
from images.pagination.pagination import ImagesPagination

class RejectedImagesViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ImageFilter
    pagination_class = ImagesPagination

    def list(self, request, *args, **kwargs):
        queryset = Images.objects.filter(status='rejected').order_by('-created_at')

        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(request, queryset, self)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)
        serializer = RejectedImagesSerializer(page, many=True)
        response = paginator.get_paginated_response(serializer.data)
        return response
    
class RejectedImagesLenghtView(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        rejected_length = Images.objects.filter(status='rejected').count()
        return Response({
            'success': True,
            'message': 'Rejected images length fetched successfully.',
            'images_length': rejected_length,
        }, status=status.HTTP_200_OK)

class UserRejectedImagesViewSet(viewsets.ViewSet):
    permission_classes = [IsRegularUser]
    renderer_classes = [JSONRenderer]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ImageFilter
    pagination_class = ImagesPagination

    def list(self, request, *args, **kwargs):
        
        user = request.user
        queryset = Images.objects.filter(user=user, status='rejected').order_by('-created_at')

        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(request, queryset, self)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)
        serializer = RejectedImagesSerializer(page, many=True)
        response = paginator.get_paginated_response(serializer.data)
        return response

class UserRejectedImagesLengthView(viewsets.ViewSet):
    permission_classes = [IsRegularUser]
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        user = request.user
        approved_length = Images.objects.filter(user=user, status='rejected').count()

        return Response({
            'success': True,
            'message': 'User rejected images count fetched successfully.',
            'images_length': approved_length,
        }, status=status.HTTP_200_OK)
