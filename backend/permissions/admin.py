from rest_framework.permissions import BasePermission
from django.utils.translation import gettext_lazy as _

class IsAdminUser(BasePermission):
    """
    ✅ Allow access only to users with role 'admin'
    """
    message = _('You must be an admin to perform this action.')

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')
    