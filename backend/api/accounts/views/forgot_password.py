from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import update_session_auth_hash
from django.conf import settings
from api.throttling import LoginRateThrottle, BurstRateThrottle

User = get_user_model()

def generate_token(user):
    """Generate a password reset token using Django's default token generator."""
    return default_token_generator.make_token(user)

def generate_reset_link(user):
    """Generate a reset password link to send to the user's email."""
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = generate_token(user)
    return f'{settings.FRONTEND_DOMAIN}/confirm-password/{uid}/{token}/'

class ForgotPasswordViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle, BurstRateThrottle]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email=email).first()

        if not user:
            return Response({
                'success': False,
                'message': 'No user with this email address found!',
            }, status=status.HTTP_404_NOT_FOUND)
        
        reset_link = generate_reset_link(user)

        try:
            send_mail(
                'Password Reset Request',
                f'Click the link to reset your password: {reset_link}',
                'robiulcc@gmail.com',
                [email],
                fail_silently=False,
            )

            return Response({"detail": "Password reset link has been sent to your email."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": f"Error sending email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResetPasswordViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle, BurstRateThrottle]

    def post(self, request, uidb64, token, *args, **kwargs):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64)) 
            print('uid : ', uid)
            user = User.objects.get(pk=uid)
            print('user : ', user)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid link or link expired."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get("new_password")
        if not new_password:
            return Response({"error": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        update_session_auth_hash(request, user)

        return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)