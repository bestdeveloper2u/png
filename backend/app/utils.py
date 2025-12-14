import os
from PIL import Image
from django.conf import settings
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from django.utils.translation import gettext_lazy as _

def validate_email(value):
    try:
        EmailValidator()(value)
    except ValidationError:
        raise ValidationError(_('Invalid email address. Please provide a correct email.'))

def validate_image_dimensions(image):
    min_width = getattr(settings, "IMAGE_UPLOAD_MIN_WIDTH", 1000)
    min_height = getattr(settings, "IMAGE_UPLOAD_MIN_HEIGHT", 1000)
    max_width = getattr(settings, "IMAGE_UPLOAD_MAX_WIDTH", 10000)
    max_height = getattr(settings, "IMAGE_UPLOAD_MAX_HEIGHT", 10000)

    try:
        with Image.open(image) as img:
            width, height = img.size
    except Exception:
        raise ValidationError('Invalid image file.')

    if width < min_width or height < min_height:
        raise ValidationError(
            _(f'Image is too small: {width}x{height}px. Minimum size is {min_width}x{min_height}px.')
        )
    if width > max_width or height > max_height:
        raise ValidationError(
            _(f'Image is too large: {width}x{height}px. Maximum size is {max_width}x{max_height}px.')
        )

def validate_image_extension(image):
    ext = os.path.splitext(image.name)[1]
    valid_extensions = ['.png']
    if ext.lower() not in valid_extensions:
        raise ValidationError(
            _(f'Unsupported file extension: {ext}. Only PNG files are allowed.')
        )

def validate_alpha(value):
    if not value.isalpha():
        raise ValidationError(_('This field should only contain letters (a-z).'))

def generate_slug(value):
    try:
        return slugify(value)
    except Exception as e:
        raise ValueError(f"Slug generation failed: {e}")
