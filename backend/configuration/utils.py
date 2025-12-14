from django.conf import settings
from configuration.models import CloudflareConfig

def get_cloudflare_config():
    config = CloudflareConfig.objects.first()
    if config:
        # Allow overriding the stored API token with an environment variable so secrets
        # don't have to live in the database.
        if getattr(settings, "CLOUDFLARE_API_TOKEN", None):
            config.api_key = settings.CLOUDFLARE_API_TOKEN
        return config
    raise Exception("Cloudflare config not found.")
