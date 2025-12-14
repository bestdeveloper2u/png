from rest_framework.permissions import BasePermission
from django.utils.translation import gettext_lazy as _

class IsRegularOrAdminUser(BasePermission):
    """
    ✅ Allow access if user is either 'user' or 'admin'
    """
    message = _('You must be a regular user or admin to perform this action.')

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and 
            request.user.role in ['user', 'admin']
        )