from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from api.throttling import TokenRefreshThrottle, BurstRateThrottle


class ThrottledTokenRefreshView(TokenRefreshView):
    throttle_classes = [TokenRefreshThrottle, BurstRateThrottle]


class ThrottledTokenVerifyView(TokenVerifyView):
    throttle_classes = [TokenRefreshThrottle, BurstRateThrottle]
