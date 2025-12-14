from django.apps import AppConfig

class ImageUploadConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'images'

    def ready(self):
        import images.signals
    