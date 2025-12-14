from django.db import models
from django.conf import settings
from django.core.validators import MinLengthValidator
from images.utils.status import STATUS_CHOICES
from core.utils import GENERATE_SLUG

class Categories(models.Model):
    name = models.CharField(
        max_length=180, 
        db_index=True, 
        unique=True,
    )
    icon = models.ImageField(
        upload_to='categories/', 
        null=True, 
        blank=True,
    )
    slug = models.SlugField(
        max_length=180, 
        db_index=True, 
        editable=False, 
        unique=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            self.slug = GENERATE_SLUG(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class SubCategories(models.Model):
    name = models.CharField(
        max_length=180, 
        db_index=True, 
        unique=True,
    )
    icon = models.ImageField(
        upload_to='sub-category/', 
        null=True, 
        blank=True,
    )
    categories = models.ForeignKey(
        Categories,
        on_delete=models.CASCADE,
        related_name='sub_categories'
    )
    slug = models.SlugField(
        max_length=180, 
        db_index=True, 
        editable=False, 
        unique=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            self.slug = GENERATE_SLUG(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Keywords(models.Model):
    name = models.CharField(
        max_length=180, 
        validators=[MinLengthValidator(3)], 
        db_index=True
    )
    slug = models.SlugField(
        max_length=180, 
        db_index=True, 
        editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            self.slug = GENERATE_SLUG(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

    
class Images(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='user',
    )
    cloudflare_id = models.CharField(
        max_length=500, 
        unique=True, 
        db_index=True, 
        null=True, 
        blank=True
    )
    name = models.CharField(
        max_length=1000, 
        unique=True, 
        db_index=True, 
        null=True, 
        blank=True
    )
    cloudflare_url = models.URLField(
        unique=True, 
        db_index=True, 
        max_length=2000, 
        null=True, 
        blank=True
    )
    title = models.CharField(
        max_length=500, 
        blank=True, 
        null=True, 
        db_index=True, 
        unique=True
    )
    slug = models.SlugField(
        unique=True, 
        max_length=500, 
        editable=False
    )
    description = models.TextField(
        max_length=5000, 
        blank=True, 
        null=True
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    download_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    keywords = models.ManyToManyField(
        Keywords, 
        related_name='images', 
        blank=True
    )

    category = models.ForeignKey(
        Categories, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='images'
    )
    sub_category = models.ForeignKey(
        SubCategories, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='images'
    )

    def save(self, *args, **kwargs):
        if not self.slug and self.title:
            self.slug = GENERATE_SLUG(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title if self.title else "Image added"
