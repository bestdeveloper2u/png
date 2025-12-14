import os
import logging
import asyncio
from celery import shared_task, group
from django.contrib.auth import get_user_model
from images.models import Images, ImageKeywords
from api.images.serializers.image import ImageSerializer
from images.services.cloudflare import UPLOAD_IMAGE_TO_CLOUDFLARE

User = get_user_model()
logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def upload_single_image(self, data):
    image_path = data.get('image_path')
    user_id = data.get('user_id')

    user = User.objects.filter(id=user_id).first()
    if not user:
        logger.error(f"[CELERY] User with ID {user_id} not found.")
        return None

    if not os.path.exists(image_path):
        logger.error(f"[CELERY] File not found: {image_path}")
        return None

    try:
        with open(image_path, 'rb') as image_file:
            # Async function কে sync থেকে চালানো
            cloudflare_data = asyncio.run(UPLOAD_IMAGE_TO_CLOUDFLARE(image_file))

        image_obj = Images.objects.create(
            title=data.get('title', ''),
            name=data.get('name', ''),
            description=data.get('description', ''),
            category=data.get('category', ''),
            cloudflare_url=cloudflare_data["url"],
            cloudflare_id=cloudflare_data["id"],
            user=user,
            status='uploaded',
        )

        keywords = data.get('keywords', '') or ''
        keywords_objs = [
            ImageKeywords(image=image_obj, name=kw.strip())
            for kw in keywords.split(",") if kw.strip()
        ]
        ImageKeywords.objects.bulk_create(keywords_objs)

        # টেম্প ফাইল ডিলিট
        try:
            os.remove(image_path)
        except Exception as e:
            logger.warning(f"[CELERY] Could not delete temp file {image_path}: {str(e)}")

        return ImageSerializer(image_obj).data

    except Exception as e:
        logger.error(f"[CELERY] Upload failed for {data.get('name')}: {str(e)}")
        self.retry(exc=e, countdown=60)  # 60 সেকেন্ড পরে retry


@shared_task(bind=True)
def upload_images_task(self, image_data_list):
    try:
        job = group(upload_single_image.s(data) for data in image_data_list)
        result = job.apply_async()
        # ১০ মিনিট টাইমআউট (600 সেকেন্ড)
        return result.get(timeout=600)
    except Exception as e:
        logger.error(f"[CELERY] upload_images_task failed: {str(e)}")
        raise
