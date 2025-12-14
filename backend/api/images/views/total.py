from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from django_filters.rest_framework import DjangoFilterBackend
from permissions.admin import IsAdminUser
from permissions.user import IsRegularUser
from images.models import Images
from api.images.serializers.total import TotalImagesSerializer
from images.filters.filters import ImageFilter
from images.pagination.pagination import ImagesPagination

class TotalImagesViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ImageFilter
    pagination_class = ImagesPagination

    def list(self, request, *args, **kwargs):
        queryset = (
            Images.objects
            .select_related("user")
            .prefetch_related("keywords")
            .order_by("-created_at")
        )

        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(request, queryset, self)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)
        serializer = TotalImagesSerializer(page, many=True)
        response = paginator.get_paginated_response(serializer.data)
        return response
    
class TotalImagesLenghtView(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        total_length = Images.objects.count()
        return Response({
            'success': True,
            'message': 'Total images lenght fetching successfully.',
            'images_lenght': total_length,
        }, status=status.HTTP_200_OK)

class UserTotalImagesViewSet(viewsets.ViewSet):
    permission_classes = [IsRegularUser]
    renderer_classes = [JSONRenderer]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ImageFilter
    pagination_class = ImagesPagination

    def list(self, request, *args, **kwargs):
        
        user = request.user
        queryset = Images.objects.filter(user=user).order_by('-created_at')

        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(request, queryset, self)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)
        serializer = TotalImagesSerializer(page, many=True)
        response = paginator.get_paginated_response(serializer.data)
        return response

class UserTotalImagesLengthView(viewsets.ViewSet):
    permission_classes = [IsRegularUser]
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        user = request.user
        approved_length = Images.objects.filter(user=user).count()

        return Response({
            'success': True,
            'message': 'User Total images count fetched successfully.',
            'images_length': approved_length,
        }, status=status.HTTP_200_OK)
    