from rest_framework_simplejwt.tokens import RefreshToken

def JWT_TOKEN(user):
    refresh = RefreshToken.for_user(user)
    token = {
        'refresh_token': str(refresh),
        'access_token': str(refresh.access_token),
    }
    return token
