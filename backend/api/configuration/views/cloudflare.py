from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from configuration.models import CloudflareConfig
from api.configuration.serializers.cloudflare import CloudflareConfigSerializer

class CloudflareConfigViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        config = CloudflareConfig.objects.first()

        if config:
            serializer = CloudflareConfigSerializer(config, data=request.data, partial=True)
        else:
            serializer = CloudflareConfigSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Cloudflare config saved.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        config = CloudflareConfig.objects.first()
        if not config:
            return Response({'detail': 'No config found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CloudflareConfigSerializer(config)
        return Response(serializer.data)
