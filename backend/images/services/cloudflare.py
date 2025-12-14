import os
import logging
import requests
import time
from celery import shared_task
import requests
from images.models import Images
from configuration.utils import get_cloudflare_config

logger = logging.getLogger(__name__)

ALLOWED_VARIANTS = ['public', 'singleimage', 'singleimagemain']

MAX_RETRIES = 5
RETRY_DELAY = 5

def UPLOAD_IMAGES_TO_CLOUDFLARE(file_bytes_io, filename="upload.png"):
    """
    Upload a PNG image to Cloudflare Images and return {id, url}.
    If variants are not ready, retry a few times.
    """
    config = get_cloudflare_config()

    _, ext = os.path.splitext(filename)
    if ext.lower() != ".png":
        raise ValueError("Only .png images are allowed")

    upload_url = f"https://api.cloudflare.com/client/v4/accounts/{config.account_id}/images/v1"
    headers = {"Authorization": f"Bearer {config.api_key}"}
    files = {"file": (filename, file_bytes_io)}

    response = requests.post(upload_url, headers=headers, files=files, timeout=60)
    response.raise_for_status()
    data = response.json()
    logger.info(f"Cloudflare upload response for {filename}: {data}")

    if not data.get("success") or "result" not in data:
        raise ValueError(f"Unexpected response from Cloudflare: {data}")

    image_id = data["result"]["id"]

    image_url = None
    for attempt in range(MAX_RETRIES):
        get_url = f"https://api.cloudflare.com/client/v4/accounts/{config.account_id}/images/v1/{image_id}"
        resp = requests.get(get_url, headers=headers, timeout=30)
        resp.raise_for_status()
        result = resp.json().get("result", {})
        variants = result.get("variants", [])

        if variants:
            image_url = variants[0]
            break
        else:
            logger.info(f"Variants not ready yet for {filename}, retrying {attempt+1}/{MAX_RETRIES}...")
            time.sleep(RETRY_DELAY)

    if not image_url:
        raise ValueError(f"Cloudflare did not return a valid URL for {filename} after retries")

    logger.info(f"image_id ---- {image_id}, cloudflare_url ---- {image_url}")
    return {"id": image_id, "url": image_url}

@shared_task
def delete_images_from_cloudflare(image_ids):
    deleted = []
    failed = []

    for image_id in image_ids:
        try:
            image = Images.objects.get(pk=image_id)
            cloudflare_id = image.cloudflare_id

            if not cloudflare_id:
                failed.append({'id': image_id, 'error': 'No Cloudflare ID found'})
                continue

            result = NUMBER_OF_IMAGE_DELETE_FROM_CLOUDFLARE(cloudflare_id)

            if result.get('success'):
                image.delete()
                deleted.append(image_id)
            else:
                failed.append({'id': image_id, 'error': result.get('error')})

        except Images.DoesNotExist:
            failed.append({'id': image_id, 'error': 'Image not found in DB'})
        except Exception as e:
            failed.append({'id': image_id, 'error': str(e)})

    return {"deleted": deleted, "failed": failed}

def NUMBER_OF_IMAGE_DELETE_FROM_CLOUDFLARE(image_id):
    config = get_cloudflare_config()
    account_id = config.account_id
    api_token = config.api_key

    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1/{image_id}"
    headers = {
        "Authorization": f"Bearer {api_token}"
    }

    try:
        response = requests.delete(url, headers=headers, timeout=10)
        result = response.json()

        if response.status_code == 200 and result.get("success"):
            return {"success": True}
        else:
            errors = result.get("errors")
            if errors:
                error_msg = "; ".join([err.get("message", str(err)) for err in errors])
            else:
                error_msg = result.get("message", "Unknown error from Cloudflare")

            return {"success": False, "error": error_msg}

    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"Request error: {str(e)}"}

    except Exception as e:
        return {"success": False, "error": f"Unexpected error: {str(e)}"}

def GET_IMAGE_URL_FROM_CLOUDFLARE(image_id, variant="public"):
    config = get_cloudflare_config()
    
    if variant not in ALLOWED_VARIANTS:
        variant = "public"
    return f"https://{config.images_domain}/{config.account_hash}/{image_id}/{variant}"

def GET_SINGLE_IMAGE_URL_FROM_CLOUDFLARE(image_id, variant="singleimage"):
    config = get_cloudflare_config()
    
    if variant not in ALLOWED_VARIANTS:
        variant = "singleimage"
    return f"https://{config.images_domain}/{config.account_hash}/{image_id}/{variant}"

def GET_SINGLE_MAIN_IMAGE_URL_FROM_CLOUDFLARE(image_id, variant="singleimagemain"):
    config = get_cloudflare_config()
    
    if variant not in ALLOWED_VARIANTS:
        variant = "singleimagemain"
    return f"https://{config.images_domain}/{config.account_hash}/{image_id}/{variant}"

def SINGLE_IMAGE_DELETE_FROM_CLOUDFLARE(image_id):
    config = get_cloudflare_config()

    account_id = config.account_id
    print('account id -- ', account_id)
    api_token = config.api_key
    print('api token -- ', api_token)

    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1/{image_id}"

    headers = {
        "Authorization": f"Bearer {api_token}"
    }

    try:
        response = requests.delete(url, headers=headers)
        print('response -- ', response)
        response.raise_for_status()

        result = response.json()
        if result.get("success"):
            return {"success": True}
        else:
            return {"success": False, "error": result.get("errors", [])}
    except Exception as e:
        return {"success": False, "error": str(e)}
    
def DELETE_ALL_IMAGE_FROM_CLOUDFLARE():
    config = get_cloudflare_config()
    account_id = config.account_id
    api_token = config.api_key
    base_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1"
    headers = {
        "Authorization": f"Bearer {api_token}"
    }

    try:
        response = requests.get(base_url, headers=headers)
        response.raise_for_status()
        images_data = response.json()

        if not images_data.get("success"):
            return {"success": False, "error": "Could not fetch images from Cloudflare."}

        deleted = []
        failed = []

        for image in images_data["result"]["images"]:
            image_id = image["id"]
            delete_url = f"{base_url}/{image_id}"
            try:
                del_res = requests.delete(delete_url, headers=headers)
                del_res.raise_for_status()
                deleted.append(image_id)
            except Exception as e:
                failed.append({"image_id": image_id, "error": str(e)})

        return {
            "success": True,
            "deleted": deleted,
            "failed": failed
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
