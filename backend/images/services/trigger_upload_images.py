from celery import group
from tasks.upload_images_task import upload_images_task
from images.utils.split_list import SPLIT_LIST

def TRIGGER_UPLOAD_IMAGES(images, chunk_size=50):

    task_group = group(
        upload_images_task.s(chunk) for chunk in SPLIT_LIST(images, chunk_size)
    )
    task_group.apply_async()
