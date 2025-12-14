from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email:
            raise serializers.ValidationError({
                'email': _('Email is required.')
            })

        if not password:
            raise serializers.ValidationError({
                'password': _('Password is required.')
            })

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if user is None:
            if not User.objects.filter(email=email).exists():
                raise serializers.ValidationError({
                    'email': _('No user found with this email.')
                })
            else:
                raise serializers.ValidationError({
                    'password': _('Incorrect password.')
                })

        if not user.is_active:
            raise serializers.ValidationError({
                'email': _('User account is disabled.')
            })
        
        # admin_login = self.context.get('admin_login', False)
        # if admin_login and not (user.is_staff or user.is_superuser):
        #     raise serializers.ValidationError({
        #         'email': _('User is not authorized as admin.')
        #     })
        # if not admin_login and (user.is_staff or user.is_superuser):
        #     raise serializers.ValidationError({
        #         'email': _('Admin users cannot login here.')
        #     })

        attrs['user'] = user
        return attrs
    