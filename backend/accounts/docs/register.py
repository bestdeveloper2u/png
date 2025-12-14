"""
User Register Api DOCS
"""
from drf_spectacular.utils import extend_schema, OpenApiResponse
from api.accounts.serializers.register import RegisterSerializer

register_schema = extend_schema(
    request=RegisterSerializer,
    responses={
        201: OpenApiResponse(
            response=RegisterSerializer,
            description="User registered successfully."
        ),
        400: OpenApiResponse(description="Validation error."),
        500: OpenApiResponse(description="Internal server error."),
    },
    description="Register a new user with email, username and password."
)