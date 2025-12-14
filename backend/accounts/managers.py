from django.contrib.auth.models import BaseUserManager
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValidationError(_('Username is required.'))
        if not email:
            raise ValidationError(_('Email is required.'))

        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('terms_accepted', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if not password:
            raise ValidationError(_('Superuser must have a password.'))

        return self.create_user(
            username, 
            email, 
            password, 
            **extra_fields
        )
