from rest_framework import serializers
from images.models import Images, Keywords

class KeywordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keywords
        fields = ['id', 'name', 'slug']

class SingleImageSerializer(serializers.ModelSerializer):
    keywords = KeywordsSerializer(many=True, read_only=True)
    class Meta:
        model = Images
        fields = ['id', 'cloudflare_id', 'cloudflare_url', 'created_at', 'description', 'slug', 'title', 'keywords', 'created_at']
