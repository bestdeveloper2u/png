from django.db.models.signals import post_delete
from django.dispatch import receiver
from accounts.models import User

@receiver(post_delete, sender=User)
def delete_user_image_file(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(save=False)
