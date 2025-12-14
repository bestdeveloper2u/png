from django.contrib import admin
from configuration.models import CloudflareConfig


@admin.register(CloudflareConfig)
class CloudflareConfigAdmin(admin.ModelAdmin):
    list_display = ('email', 'account_id', 'endpoint', 'updated_at')
    readonly_fields = ('updated_at',)
    
    fieldsets = (
        ('API Settings', {'fields': ('api_key', 'account_id', 'account_hash', 'email')}),
        ('Configuration', {'fields': ('images_domain', 'endpoint')}),
        ('Metadata', {'fields': ('updated_at',)}),
    )
    
    def has_add_permission(self, request):
        if CloudflareConfig.objects.exists():
            return False
        return super().has_add_permission(request)
