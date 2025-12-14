from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from django.utils.translation import gettext_lazy as _

APPROVED_IMAGES_SCHEMA = extend_schema(
    responses={
        200: OpenApiResponse(
            description=_('')
        )
    }
)
