from rest_framework import serializers
from images.models import Categories, SubCategories, Images

class ImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = ['id', 'title', 'slug']

class CategoriesSerializers(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ['id', 'icon', 'name', 'slug']

class SubCategoriesSerializers(serializers.ModelSerializer):
    class Meta:
        model = SubCategories
        fields = ['id', 'icon', 'name', 'slug']

class CreateSubCategoriesSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    icon = serializers.ImageField(required=True)
    categories = serializers.PrimaryKeyRelatedField(
        queryset=Categories.objects.all(),
        required=True,
        error_messages={
            'does_not_exist': 'The selected category does not exist.',
            'required': 'Category is required.'
        }
    )
    class Meta:
        model = SubCategories
        fields = ['name', 'icon', 'categories']

class ImagesListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = '__all__'

class SingleSubCategoriesSerializer(serializers.ModelSerializer):
    categories = CategoriesSerializers(read_only=True)
    images = ImagesListSerializer(many=True, read_only=True)

    class Meta:
        model = SubCategories
        fields = ['id', 'icon', 'name', 'slug', 'categories', 'images']
