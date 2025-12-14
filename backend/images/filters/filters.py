from django_filters import rest_framework as filters
from django.db.models import Q
from images.models import Images, SubCategories, Categories
from core.utils import GENERATE_SLUG

class SubCategoriesFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = SubCategories
        fields = ['name']

class CategoriesFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = Categories
        fields = ['name']

class ImageFilterKeyword(filters.FilterSet):
    keyword = filters.CharFilter(method='filter_by_keyword')

    def filter_by_keyword(self, queryset, name, value):
        slug_value = GENERATE_SLUG(value.strip())
        return queryset.filter(
            keywords__slug__exact=slug_value
        ).distinct()

    class Meta:
        model = Images
        fields = ['keyword']

class ImageFilter(filters.FilterSet):
    title = filters.CharFilter(method='filter_by_slug')
    keyword = filters.CharFilter(method='filter_by_keyword')

    def filter_by_slug(self, queryset, name, value):
        slug_value = GENERATE_SLUG(value.strip())
        return queryset.filter(
            slug__icontains=slug_value
        ).distinct()

    def filter_by_keyword(self, queryset, name, value):
        slug_value = GENERATE_SLUG(value.strip())
        return queryset.filter(
            keywords__slug__icontains=slug_value
        ).distinct()

    class Meta:
        model = Images
        fields = ['title', 'keyword']
