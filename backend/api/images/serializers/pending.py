from rest_framework import serializers
from images.models import Images, Categories, SubCategories, Keywords
from accounts.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class KeywordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keywords
        fields = ['id', 'name', 'slug']

class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ['id', 'name', 'slug']

class SubCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategories
        fields = ['id', 'name', 'slug']

class PendingImagesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    keywords = KeywordsSerializer(many=True, read_only=True)
    category = CategoriesSerializer(read_only=True)
    sub_category = SubCategoriesSerializer(read_only=True)
    class Meta:
        model = Images
        fields = ['id', 'cloudflare_id', 'cloudflare_url', 'title', 'slug', 'description', 'download_count', 'status', 'created_at', 'user', 'keywords', 'category', 'sub_category']
