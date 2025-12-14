from django.db import models
from django.core.validators import MinLengthValidator, RegexValidator
from django.contrib.auth.models import AbstractBaseUser
from django.core.exceptions import ValidationError as DjangoValidationError
from accounts.utils.genders import GENDERS
from accounts.utils.roles import ROLES
from accounts.utils.image_upload import USER_DIRECTORY_PATH
from core.utils import VALIDATE_IMAGE_SIZE, VALIDATE_EMAIL, VALIDATE_ALPHA
from accounts.managers import UserManager
from core.utils import GENERATE_SLUG
from django.utils.translation import gettext_lazy as _

class User(AbstractBaseUser):
    image = models.ImageField(
        validators=[VALIDATE_IMAGE_SIZE],
        upload_to=USER_DIRECTORY_PATH,
        null=True,
        blank=True,
    )
    username = models.CharField(
        unique=True,
        db_index=True,
        max_length=80,
        validators=[
            MinLengthValidator(3),
            RegexValidator(
                regex=r'^[a-zA-Z0-9_]+$',
                message=_('Username can only contain letters, numbers, and underscores.'),
            ),
        ],
    )
    slug = models.SlugField(
        unique=True,
        max_length=120,
        editable=False,
    )
    email = models.EmailField(
        max_length=180,
        unique=True,
        db_index=True,
        validators=[MinLengthValidator(10), VALIDATE_EMAIL],
    )
    first_name = models.CharField(
        max_length=20,
        db_index=True,
        validators=[MinLengthValidator(3), VALIDATE_ALPHA],
        blank=True,
        null=True,
    )
    last_name = models.CharField(
        max_length=20,
        db_index=True,
        validators=[MinLengthValidator(3), VALIDATE_ALPHA],
        blank=True,
        null=True,
    )
    number = models.CharField(
        max_length=20,
        db_index=True,
        validators=[MinLengthValidator(11)],
        blank=True,
        null=True,
    )
    gender = models.CharField(
        max_length=10,
        choices=GENDERS,
        blank=True,
        null=True,
    )
    role = models.CharField(
        max_length=10,
        choices=ROLES,
        default='user',
    )
    terms_accepted = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_block = models.BooleanField(default=False)
    is_superuser= models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return self.username or self.email
    
    def clean(self):
        if self.role == 'admin':
            existing_admin = User.objects.filter(role='admin')
            if self.pk:
                existing_admin = existing_admin.exclude(pk=self.pk)
            if existing_admin.exists():
                raise DjangoValidationError(_('Only one admin is allowed.'))
            
        if self.username and not self.slug:
            self.slug = GENERATE_SLUG(self.username)
            
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        if self.image:
            self.image.delete(save=False)
        super().delete(using=using, keep_parents=keep_parents)
