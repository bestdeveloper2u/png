import requests
from django.http import HttpResponse, Http404
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from images.models import Images
from django.db import models
from django.utils.text import slugify
from configuration.utils import get_cloudflare_config
from django.db.models import Sum
from api.throttling import PublicEndpointThrottle, BurstRateThrottle, SustainedRateThrottle

class AllImageDownloadCountViewSet(viewsets.ViewSet):
    """
    Returns total downloads of all images.
    """
    permission_classes = [IsAdminUser]

    def list(self, request):
        total_downloads = Images.objects.aggregate(total=models.Sum('download_count'))['total'] or 0
        return Response({
            "success": True,
            "total_downloads": total_downloads
        }, status=status.HTTP_200_OK)

class AllImageContributorDownloadCountViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user

        total_downloads = Images.objects.filter(user=user).aggregate(
            total=Sum('download_count')
        )['total'] or 0

        return Response({
            "success": True,
            "total_downloads": total_downloads
        }, status=status.HTTP_200_OK)

class DownloadImageViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    throttle_classes = [PublicEndpointThrottle, BurstRateThrottle, SustainedRateThrottle]

    def retrieve(self, request, pk=None):
        config = get_cloudflare_config()
        image_id = pk

        try:
            image = Images.objects.get(cloudflare_id=image_id)
        except Images.DoesNotExist:
            raise Http404("Image not found")

        variant = "singleimage" 
        image_url = f"https://{config.images_domain}/{config.account_hash}/{image_id}/{variant}"

        try:
            response = requests.get(image_url, stream=True)
            response.raise_for_status()
        except requests.exceptions.RequestException:
            raise Http404("Unable to fetch image from Cloudflare.")

        image.download_count += 1
        image.save(update_fields=["download_count"])

        filename = f"{slugify(image.title or image_id)}.png"
        content_type = response.headers.get("Content-Type", "image/png")

        return HttpResponse(
            response.content,
            content_type=content_type,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
