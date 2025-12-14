from django.contrib import admin
from images.models import Categories, SubCategories, Keywords, Images


@admin.register(Categories)
class CategoriesAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at', 'updated_at')
    search_fields = ('name', 'slug')
    readonly_fields = ('slug', 'created_at', 'updated_at')
    ordering = ('name',)


@admin.register(SubCategories)
class SubCategoriesAdmin(admin.ModelAdmin):
    list_display = ('name', 'categories', 'slug', 'created_at')
    list_filter = ('categories',)
    search_fields = ('name', 'slug')
    readonly_fields = ('slug', 'created_at', 'updated_at')
    ordering = ('name',)


@admin.register(Keywords)
class KeywordsAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name', 'slug')
    readonly_fields = ('slug', 'created_at', 'updated_at')
    ordering = ('name',)


@admin.register(Images)
class ImagesAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'category', 'download_count', 'created_at')
    list_filter = ('status', 'category', 'sub_category', 'created_at')
    search_fields = ('title', 'name', 'description', 'slug')
    readonly_fields = ('slug', 'download_count', 'created_at', 'updated_at')
    filter_horizontal = ('keywords',)
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('user', 'title', 'slug', 'description')}),
        ('Cloudflare', {'fields': ('cloudflare_id', 'name', 'cloudflare_url')}),
        ('Classification', {'fields': ('category', 'sub_category', 'keywords', 'status')}),
        ('Stats', {'fields': ('download_count', 'created_at', 'updated_at')}),
    )
