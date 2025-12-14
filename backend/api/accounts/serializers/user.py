from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'image', 'username', 'slug', 'email', 'first_name', 'last_name', 'number', 'gender', 'role', 'terms_accepted', 'is_active', 'is_block', 'date_joined']

class UserDownloadSerializer(serializers.ModelSerializer):
    total_downloads = serializers.IntegerField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'total_downloads']
        