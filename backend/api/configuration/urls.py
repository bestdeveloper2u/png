from django.urls import path
from api.configuration.views.cloudflare import CloudflareConfigViewSet

cloudflare_config = CloudflareConfigViewSet.as_view({
    'post': 'create',
    'get': 'retrieve'
})

urlpatterns = [
    path('cloudflare/config/', cloudflare_config, name='cloudflare-config'),
]
