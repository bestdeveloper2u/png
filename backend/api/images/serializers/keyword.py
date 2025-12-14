from rest_framework import serializers
from images.models import Keywords

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keywords
        fields = ['id', 'name', 'slug']
