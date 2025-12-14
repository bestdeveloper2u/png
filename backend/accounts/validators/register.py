from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

def VALIDATE_TERMS_ACCEPTED(value):
    if not value:
        raise serializers.ValidationError(_('You must accept the terms and conditions.'))
    return value
