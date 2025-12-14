import os
from django.conf import settings

def save_files_temporarily(images):
    saved_paths = []
    upload_dir = os.path.join(settings.MEDIA_ROOT, "temp_uploads")
    os.makedirs(upload_dir, exist_ok=True)

    for img in images:
        filename = f"{img.name}"
        file_path = os.path.join(upload_dir, filename)

        with open(file_path, "wb+") as destination:
            for chunk in img.chunks():
                destination.write(chunk)

        saved_paths.append(file_path)
        
    return saved_paths
