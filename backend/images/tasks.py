from io import BytesIO
import os
import logging
from celery import shared_task
from images.models import Images
from images.services.cloudflare import UPLOAD_IMAGES_TO_CLOUDFLARE

logger = logging.getLogger(__name__)

@shared_task
def process_bulk_upload(images_path, image_ids, metadata=None, user_id=None):
    """
    Upload multiple images to Cloudflare and update DB.
    """
    for i, path in enumerate(images_path):
        original_name = os.path.basename(path)
        try:
            with open(path, "rb") as f:
                file_bytes = f.read()

            logger.info(f"Uploading {original_name} to Cloudflare...")

            cloudflare_data = UPLOAD_IMAGES_TO_CLOUDFLARE(BytesIO(file_bytes), filename=original_name)

            img_obj = Images.objects.get(id=image_ids[i])
            img_obj.cloudflare_url = cloudflare_data["url"]
            img_obj.cloudflare_id = cloudflare_data["id"]
            img_obj.save()

            logger.info(f"Uploaded image {img_obj.id} successfully. URL: {cloudflare_data['url']}")

        except Exception as e:
            logger.error(f"Failed to upload {original_name}: {str(e)}")

        finally:
            if os.path.exists(path):
                try:
                    os.remove(path)
                    logger.info(f"Deleted temp file: {path}")
                except PermissionError as pe:
                    logger.error(f"Could not delete temp file {path}: {str(pe)}")
