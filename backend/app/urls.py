from django.urls import path, include
from django.conf import settings
from django.http import JsonResponse
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import admin
from api.accounts.views.token import ThrottledTokenRefreshView, ThrottledTokenVerifyView

BASE_API = 'api/v1'

urlpatterns = [
    path('', lambda request: JsonResponse({"message": "Welcome to the png point API"})),
    path('admin/', admin.site.urls),
    path(f'{BASE_API}/images/', include('api.images.urls')),
    path(f'{BASE_API}/accounts/', include('api.accounts.urls')),
    path(f'{BASE_API}/configuration/', include('api.configuration.urls')),
    path(f'{BASE_API}/token/refresh/', ThrottledTokenRefreshView.as_view(), name='token_refresh'),
    path(f'{BASE_API}/token/verify/', ThrottledTokenVerifyView.as_view(), name='token_verify'),
]

if 'schema_viewer' in settings.INSTALLED_APPS and settings.DEBUG:
    urlpatterns += [
        path(f'{BASE_API}/database-desing/', include('schema_viewer.urls')),
    ]

if 'drf_spectacular' in settings.INSTALLED_APPS and settings.DEBUG:
    from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
    urlpatterns += [
        path(f'{BASE_API}/schema/', SpectacularAPIView.as_view(), name='schema'),
        path(f'{BASE_API}/schema/swagger-ui/', SpectacularSwaggerView.as_view(), name='swagger_ui'),
        path(f'{BASE_API}/schema/redoc/', SpectacularRedocView.as_view(), name='redoc'),
    ]

def custom_404(request, exception):
    return JsonResponse({
        'success': False,
        'message': 'Page not found',
        'error': 404
    }, status=404)

def custom_500(request):
    return JsonResponse({
        'success': False,
        'message': 'Internal server error',
        'error': 500
    }, status=500)

handler404 = 'app.urls.custom_404'
handler500 = 'app.urls.custom_500'

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += staticfiles_urlpatterns()
