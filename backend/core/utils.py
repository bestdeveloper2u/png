import os
import requests
import logging
import phonenumbers
from PIL import Image
from django.conf import settings
from django.utils.text import slugify
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from rest_framework.response import Response
from rest_framework import status
from django.utils.translation import gettext_lazy as _

logger = logging.getLogger(__name__)

def VALIDATE_IMAGE_EXTENSION(image):
    ext = os.path.splitext(image.name)[1].lower()
    allowed_extensions = getattr(settings, "IMAGE_UPLOAD_ALLOWED_EXTENSIONS", ['.png'])
    if ext not in allowed_extensions:
        allowed = ", ".join(allowed_extensions)
        raise ValidationError(
            _(f'Unsupported file extension "{ext}". Allowed types: {allowed}.')
        )
    
def VALIDATE_IMAGE_SIZE(image):
    max_size_mb = getattr(settings, "IMAGE_UPLOAD_MAX_SIZE_MB", 10)
    max_size = max_size_mb * 1024 * 1024
    if image.size > max_size:
        raise ValidationError(_(f'The image file size must be less than {max_size_mb} MB.'))

def VALIDATE_IMAGE_DIMENSIONS(image):
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

def VALIDATE_EMAIL(value):
    try:
        EmailValidator()(value)
    except ValidationError:
        raise ValidationError(_('Invalid email address. Please provide a correct email.'))
    
def VALIDATE_PHONE_NUMBER(value):
    try:
        parsed = phonenumbers.parse(value, None)
        if not phonenumbers.is_valid_number(parsed):
            raise ValidationError(_("Invalid phone number. Please enter a valid  phone number."))
    except phonenumbers.NumberParseException:
        raise ValidationError(_("Invalid phone number format. Please enter a valid number with correct country code if applicable."))
    
def VALIDATE_ALPHA(value):
    if not value.isalpha():
        raise ValidationError(_('This field should only contain letters (a-z).'))

def GENERATE_SLUG(value):
    try:
        return slugify(value)
    except Exception as e:
        raise ValueError(f"Slug generation failed: {e}")

def success_response(message="Request successful.", data=None, status_code=status.HTTP_200_OK):
    return Response({
        "success": True,
        "message": message,
        "data": data,
    }, status=status_code)

def error_response(message="An error occurred.", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({
        "success": False,
        "message": message,
        "errors": errors,
    }, status=status_code)

def trigger_nextjs_revalidate(path="/categories"):
    """
    Call Next.js revalidation API to invalidate ISR cache for `path`.
    """
    try:
        if not settings.REVALIDATE_SECRET or not settings.NEXTJS_URL:
            logger.warning("Revalidation skipped; secret or NEXTJS_URL not configured.")
            return False

        url = f"{settings.NEXTJS_URL.rstrip('/')}/api/revalidate"
        payload = {
            "secret": settings.REVALIDATE_SECRET,
            "path": path
        }
        resp = requests.post(url, json=payload, timeout=5)
        if resp.status_code == 200:
            logger.info(f"Next.js revalidated: {path}")
            return True

        logger.error(f"Next.js revalidate failed ({resp.status_code}): {resp.text}")
        return False
    except Exception as exc:
        logger.exception(f"Error while calling Next.js revalidate: {exc}")
        return False
    
def clear_images_cache_by_status(status: str):
    """
    Remove cached pages for a given status and print which keys were deleted.
    """
    patterns = {
        "approved": "approved_images",
        "pending": "pending_images",
        "rejected": "rejected_images",
        "total": "total_images",
    }

    key_pattern = patterns.get(status)
    if key_pattern:
        # get all keys from cache
        keys = cache.keys(f"pngpoint:{key_pattern}:*")
        if keys:
            print(f"[CACHE CLEAR] Status '{status}' - Deleting keys: {keys}")
            for key in keys:
                cache.delete(key)
        else:
            print(f"[CACHE CLEAR] Status '{status}' - No keys found to delete.")
        
