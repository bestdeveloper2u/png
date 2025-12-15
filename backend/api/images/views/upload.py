import logging
import os
import random
from django.utils.text import slugify
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from api.throttling import UploadThrottle, BurstRateThrottle
from django.db import transaction
from images.models import Images, Keywords
from images.tasks import process_bulk_upload
from images.services.cloudflare import UPLOAD_IMAGES_TO_CLOUDFLARE
from core.utils import (
    VALIDATE_IMAGE_EXTENSION,
    VALIDATE_IMAGE_SIZE,
    VALIDATE_IMAGE_DIMENSIONS,
)
from django.conf import settings
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

def make_unique_title_and_slug(title, used_titles=None):

    if used_titles is None:
        used_titles = set()

    original_title = title.strip()
    new_title = original_title

    while Images.objects.filter(title=new_title).exists() or new_title in used_titles:
        random_number = random.randint(100, 999)
        if original_title.endswith("."):
            new_title = f"{original_title[:-1]}{random_number}."
        else:
            new_title = f"{original_title}{random_number}"

    used_titles.add(new_title)

    base_slug = slugify(new_title)
    new_slug = base_slug
    counter = 1
    while Images.objects.filter(slug=new_slug).exists():
        new_slug = f"{base_slug}-{counter}"
        counter += 1

    return new_title, new_slug, used_titles

class ImagesUploadAPIView(APIView):
    parser_classes = [MultiPartParser, JSONParser]
    permission_classes = [IsAuthenticated]
    throttle_classes = [UploadThrottle, BurstRateThrottle]

    def post(self, request, *args, **kwargs):
        images = request.FILES.getlist("images")
        titles = request.data.getlist("title")
        descriptions = request.data.getlist("description")
        keywords_list = request.data.getlist("keywords")
        use_async = getattr(settings, "USE_ASYNC_IMAGE_UPLOADS", True)

        if not images:
            return Response({
                "success": False,
                "error": "No images provided"
            }, status=status.HTTP_400_BAD_REQUEST)

        max_images = getattr(settings, "MAX_UPLOAD_IMAGES_PER_REQUEST", 3)
        if len(images) > max_images:
            return Response({
                "success": False,
                "error": f"Too many images in one request. Maximum is {max_images}."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        created_images = []
        failed_images = []
        used_titles = set()
        temp_paths = []
        image_ids = []
        inline_uploads = use_async is False

        for i, image_file in enumerate(images):
            try:
                temp_path = None
                try:
                    title = titles[i].strip()
                except IndexError:
                    raise ValueError(f"Title is required for image {i+1}")
                if not title:
                    raise ValueError(f"Title cannot be empty for image {i+1}")
                
                title, slug, used_titles = make_unique_title_and_slug(title, used_titles)

                description = descriptions[i] if i < len(descriptions) else ""
                keyword_str = keywords_list[i] if i < len(keywords_list) else ""

                try:
                    VALIDATE_IMAGE_EXTENSION(image_file)
                    VALIDATE_IMAGE_SIZE(image_file)
                    VALIDATE_IMAGE_DIMENSIONS(image_file)
                    image_file.seek(0)
                except ValidationError as exc:
                    raise ValueError(str(exc))

                if inline_uploads:
                    cloudflare_data = UPLOAD_IMAGES_TO_CLOUDFLARE(
                        image_file, filename=image_file.name
                    )
                    with transaction.atomic():
                        img_obj = Images.objects.create(
                            user=request.user,
                            title=title,
                            slug=slug,
                            description=description,
                            cloudflare_id=cloudflare_data["id"],
                            cloudflare_url=cloudflare_data["url"],
                        )

                        if keyword_str:
                            raw_keywords = [k.strip() for k in keyword_str.split(",") if k.strip()]
                            seen = set()
                            keyword_objs = []
                            for kw in raw_keywords:
                                slugified_kw = slugify(kw)
                                if not slugified_kw or slugified_kw in seen:
                                    continue
                                seen.add(slugified_kw)
                                keyword = Keywords.objects.filter(slug=slugified_kw).first()
                                if not keyword:
                                    keyword = Keywords.objects.create(name=kw, slug=slugified_kw)
                                keyword_objs.append(keyword)

                            if keyword_objs:
                                img_obj.keywords.add(*keyword_objs)

                        created_images.append({
                            "id": img_obj.id,
                            "title": img_obj.title,
                            "slug": img_obj.slug,
                            "status": "success"
                        })
                else:
                    upload_dir = os.path.join(settings.MEDIA_ROOT, "temp_uploads")
                    os.makedirs(upload_dir, exist_ok=True)
                    temp_filename = f"{slug}-{image_file.name}"
                    temp_path = os.path.join(upload_dir, temp_filename)
                    with open(temp_path, "wb+") as destination:
                        for chunk in image_file.chunks():
                            destination.write(chunk)
                    
                    with transaction.atomic():
                        img_obj = Images.objects.create(
                            user=request.user,
                            title=title,
                            slug=slug,
                            description=description,
                            status='pending',
                        )

                        if keyword_str:
                            raw_keywords = [k.strip() for k in keyword_str.split(",") if k.strip()]
                            seen = set()
                            keyword_objs = []
                            for kw in raw_keywords:
                                slugified_kw = slugify(kw)
                                if not slugified_kw or slugified_kw in seen:
                                    continue
                                seen.add(slugified_kw)
                                keyword = Keywords.objects.filter(slug=slugified_kw).first()
                                if not keyword:
                                    keyword = Keywords.objects.create(name=kw, slug=slugified_kw)
                                keyword_objs.append(keyword)

                            if keyword_objs:
                                img_obj.keywords.add(*keyword_objs)

                        temp_paths.append(temp_path)
                        image_ids.append(img_obj.id)

                        created_images.append({
                            "id": img_obj.id,
                            "title": img_obj.title,
                            "slug": img_obj.slug,
                            "status": "pending"
                        })

            except Exception as e:
                if 'temp_path' in locals():
                    try:
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                    except Exception:
                        pass
                failed_images.append({
                    "filename": getattr(image_file, "name", f"image_{i+1}"),
                    "error": str(e),
                    "status": "failed"
                })

        if image_ids and not inline_uploads:
            try:
                process_bulk_upload.delay(temp_paths, image_ids, metadata=None, user_id=request.user.id)
            except Exception as e:
                logger.error(f"Failed to enqueue upload task: {str(e)}")
                for path in temp_paths:
                    try:
                        if os.path.exists(path):
                            os.remove(path)
                    except Exception:
                        pass
                failed_images.extend([{
                    "filename": os.path.basename(path),
                    "error": "Failed to enqueue upload task",
                    "status": "failed"
                } for path in temp_paths])
                created_images = []

        return Response({
            "success": True,
            "message": f"{len(created_images)} images uploaded, {len(failed_images)} failed.",
            "uploaded": created_images,
            "failed": failed_images
        }, status=status.HTTP_207_MULTI_STATUS if failed_images else status.HTTP_201_CREATED)
