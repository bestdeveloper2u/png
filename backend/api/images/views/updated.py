from rest_framework import status, viewsets
from rest_framework.response import Response
from permissions.or_permission import IsRegularOrAdminUser
from django.shortcuts import get_object_or_404
from images.models import Images, Categories, SubCategories
from api.images.serializers.updated import UpdatedImageSerializer

class SelectedImageUpdateView(viewsets.ViewSet):
    permission_classes = [IsRegularOrAdminUser]

    def update(self, request, *args, **kwargs):
        try:
            image_ids = request.data.get("image_ids")
            status_value = request.data.get("status")
            category_value = request.data.get("category")
            sub_category_value = request.data.get("sub_category")

            if not image_ids or not isinstance(image_ids, list):
                return Response({
                    'success': False,
                    'message': 'image_ids must be a list of IDs.'
                }, status=status.HTTP_400_BAD_REQUEST)

            if not status_value and not category_value and not sub_category_value:
                return Response({
                    'success': False,
                    'message': 'At least one field (status, category, sub_category) is required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            updated_images = []

            # Try fetching the category and subcategory if provided
            category_obj = None
            sub_category_obj = None

            if category_value:
                category_obj = get_object_or_404(Categories, pk=category_value)

            if sub_category_value:
                sub_category_obj = get_object_or_404(SubCategories, pk=sub_category_value)

            # Loop through all selected image IDs
            for image_id in image_ids:
                try:
                    image = Images.objects.get(id=image_id)

                    # Update only the fields provided
                    if status_value:
                        image.status = status_value
                    if category_obj:
                        image.category = category_obj
                    if sub_category_obj:
                        image.sub_category = sub_category_obj

                    image.save()
                    updated_images.append(image.id)

                except Images.DoesNotExist:
                    continue

            return Response({
                'success': True,
                'message': f'{len(updated_images)} image(s) updated successfully.',
                'updated_ids': updated_images
            }, status=status.HTTP_200_OK)

        except Exception:
            return Response({
                'success': False,
                'message': 'Internal server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SingleImageUpdateView(viewsets.ViewSet):
    permission_classes = [IsRegularOrAdminUser]

    def update(self, request, pk=None):
        try:
            image = get_object_or_404(Images, pk=pk)
            data = request.data

            serializer = UpdatedImageSerializer(image, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Image updated successfully.',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'message': 'Validation failed.',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception:
            return Response({
                'success': False,
                'message': 'Internal server error',
                'errors': {},
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NumberOfImageUpdateView(viewsets.ViewSet):
    permission_classes = [IsRegularOrAdminUser]

    def update(self, request, *args, **kwargs):
        try:
            image_ids = request.data.get("image_ids")
            if not image_ids or not isinstance(image_ids, list):
                return Response({
                    'success': False,
                    'message': 'image_ids must be a list of IDs.'
                }, status=status.HTTP_400_BAD_REQUEST)

            base_data = request.data.copy()
            base_data.pop("image_ids", None)

            if 'keywords' in base_data:
                base_data['keyword_items'] = base_data.pop('keywords')

            success_updates = []
            failed_updates = []

            for image_id in image_ids:
                try:
                    image = get_object_or_404(Images, pk=image_id)

                    data = base_data.copy()
                    serializer = UpdatedImageSerializer(image, data=data, partial=True)

                    if serializer.is_valid():
                        serializer.save()
                        success_updates.append(image_id)
                    else:
                        failed_updates.append({
                            'id': image_id,
                            'errors': serializer.errors
                        })

                except Exception:
                    failed_updates.append({
                        'id': image_id,
                        'error': 'Failed to update'
                    })

            return Response({
                'success': True,
                'message': 'Batch image update completed.',
                'updated_images': success_updates,
                'failed_updates': failed_updates
            }, status=status.HTTP_200_OK)

        except Exception:
            return Response({
                'success': False,
                'message': 'Internal server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
