from django.urls import path
from api.accounts.views.register import RegisterViewSet
from api.accounts.views.login import UserLoginView, AdminLoginView
from api.accounts.views.user import UserProfileView, UserListView, AdminUpdateUserViewSet, UserDownloadCountViewSet
from api.accounts.views.user import UserProfileUpdateView
from api.accounts.views.user import UserPasswodChangeView
from api.accounts.views.forgot_password import ForgotPasswordViewSet, ResetPasswordViewSet

urlpatterns = [
    path(
        'user/register/',
        RegisterViewSet.as_view({ 'post' : 'create' }),
        name='register',
    ),
    path(
        'user/login/',
        UserLoginView.as_view(),
        name='login',
    ),
    path(
        'admin/login/',
        AdminLoginView.as_view(),
        name='admin_login',
    ),
    path(
        'user/profile/',
        UserProfileView.as_view({'get': 'list'}),
        name='user_profile',
    ),
    path(
        'user/profile/update/',
        UserProfileUpdateView.as_view({ 'patch': 'update' }),
        name='user_profile_update',
    ),
    path(
        'user/password/change/',
        UserPasswodChangeView.as_view({'post': 'post'}),
        name='user_passwod_change',
    ),
    path(
        'user/forgot-password/',
        ForgotPasswordViewSet.as_view({'post': 'post'}),
        name='forgot_password',
    ),
    path(
        'user/reset-password/<uidb64>/<token>/',
        ResetPasswordViewSet.as_view({'post': 'post'}),
        name='reset_password',
    ),
    path(
        'users-list/',
        UserListView.as_view({ 'get': 'list' }),
        name='users_list',
    ),
    path(
        'user/download-count/',
        UserDownloadCountViewSet.as_view({ 'get': 'list' }),
        name='user_download_count',
    ),
    path(
        'user/admin/update/<int:pk>/',
        AdminUpdateUserViewSet.as_view({'patch': 'update'}),
        name='update_user',
    ),
]
