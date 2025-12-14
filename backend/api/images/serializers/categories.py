from rest_framework import serializers
from images.models import Categories, SubCategories

class SubCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategories
        fields = ['id', 'icon', 'name', 'slug']

class CategoriesSerializer(serializers.ModelSerializer):
    sub_categories = SubCategoriesSerializer(many=True, read_only=True)
    class Meta:
        model = Categories
        fields = ['id', 'icon', 'name', 'slug', 'sub_categories']
        
class CreateCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ['name', 'icon']
        extra_kwargs = {
            'name': {'required': True},
            'icon': {'required': True},
        }

class SingleCategoriesSerializer(serializers.ModelSerializer):
    sub_categories = SubCategoriesSerializer(many=True, read_only=True)
    class Meta:
        model = Categories
        fields = ['id', 'icon', 'name', 'slug', 'sub_categories']
        