from django.db import models

# Create your models here.

class CloudflareConfig(models.Model):
    api_key = models.CharField(max_length=255)
    account_id = models.CharField(max_length=255)
    account_hash = models.CharField(max_length=255)
    images_domain = models.CharField(max_length=255)
    email = models.EmailField()
    endpoint = models.CharField(max_length=100, default="verify")
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.pk and CloudflareConfig.objects.exists():
            CloudflareConfig.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return "Cloudflare Configuration"
        