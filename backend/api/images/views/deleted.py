from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from permissions.or_permission import IsRegularOrAdminUser
from images.models import Images
from django.shortcuts import get_object_or_404
from images.services.cloudflare import SINGLE_IMAGE_DELETE_FROM_CLOUDFLARE, DELETE_ALL_IMAGE_FROM_CLOUDFLARE
from images.services.cloudflare import delete_images_from_cloudflare

class SingleImageDeleteView(viewsets.ViewSet):
    permission_classes = [IsRegularOrAdminUser]

    def destroy(self, request, pk=None):
        try:
            image = get_object_or_404(Images, pk=pk)
            cloudflare_id = image.cloudflare_id

            if not cloudflare_id:
                return Response({
                    'success': False,
                    'error': 'No Cloudflare ID found for this image. Cannot delete.'
                }, status=status.HTTP_400_BAD_REQUEST)

            result = SINGLE_IMAGE_DELETE_FROM_CLOUDFLARE(cloudflare_id)

            if not result.get('success'):
                return Response({
                    'success': False,
                    'error': 'Cloudflare deletion failed',
                    'details': result.get('error')
                }, status=status.HTTP_400_BAD_REQUEST)

            image.delete()

            return Response({
                'success': True,
                'message': 'Image deleted from DB and Cloudflare.'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'message': 'Internal server error',
                'errors': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NumberOfImageDeleteView(APIView):
    permission_classes = [IsRegularOrAdminUser]

    def post(self, request, pk=None):
        image_ids = request.data.get("image_ids", [])
        if not isinstance(image_ids, list) or not image_ids:
            return Response({
                'error': 'Provide a list of image IDs.',
            }, status=status.HTTP_400_BAD_REQUEST)

        delete_images_from_cloudflare(image_ids)

        return Response({
            'success': True,
            'message': 'Image deletion started. You will be notified when the process completes.',
        }, status=status.HTTP_202_ACCEPTED)

class ALLImageDeleteView(viewsets.ViewSet):
    permission_classes = [IsRegularOrAdminUser]

    def destroy(self, request, pk=None):
        try:
            result = DELETE_ALL_IMAGE_FROM_CLOUDFLARE()
            if not result.get('success'):
                return Response({
                    'error': 'Failed to delete Cloudflare images', 
                    'details': result.get('error')
                }, status=status.HTTP_400_BAD_REQUEST)

            Images.objects.all().delete()

            return Response({
                'success': True,
                'cloudflare_deleted': result.get('deleted', []),
                'cloudflare_failed': result.get('failed', [])
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

