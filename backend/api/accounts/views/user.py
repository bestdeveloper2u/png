from rest_framework import viewsets, status
from rest_framework.response import Response
from permissions.or_permission import IsRegularOrAdminUser
from permissions.admin import IsAdminUser
from api.accounts.serializers.user import UserSerializer, UserDownloadSerializer
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.renderers import JSONRenderer, MultiPartRenderer
from django.contrib.auth import get_user_model
from api.accounts.pagination.paginations import StandardResultsSetPagination
from accounts.models import User
from django.db.models import Sum

User = get_user_model()

class UserListView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return User.objects.exclude(role='admin').exclude(is_superuser=True)
    
class UserDownloadCountViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    def list(self, request):
        users = User.objects.annotate(
            total_downloads=Sum('user__download_count')
        ).exclude(total_downloads=None)
        serializer = UserDownloadSerializer(users, many=True)
        return Response({
            "success": True,
            "users": serializer.data
        }, status=status.HTTP_200_OK)
    
class UserPasswodChangeView(viewsets.ViewSet):
    permission_classes = [IsRegularOrAdminUser]

    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not user.check_password(old_password):
            return Response({'detail': 'Old password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'detail': 'New passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        if not new_password or len(new_password) < 5:
            return Response({'detail': 'New password must be at least 5 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)

class UserProfileUpdateView(viewsets.ViewSet):
    permission_classes = [IsRegularOrAdminUser]
    parser_classes = [FormParser, MultiPartParser, JSONParser]

    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsRegularOrAdminUser]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
class AdminUpdateUserViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer, MultiPartRenderer]
    parser_classes = [JSONParser]

    def update(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'User not found',
            }, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Validation error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response({
                'success': True,
                'message': 'User updated successfully',
                'data': serializer.data,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Internal Server Error',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
