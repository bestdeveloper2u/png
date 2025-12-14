from rest_framework import serializers
from configuration.models import CloudflareConfig

class CloudflareConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudflareConfig
        fields = '__all__'
        