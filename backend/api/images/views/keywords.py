from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from images.models import Keywords
from api.images.serializers.keyword import KeywordSerializer
from api.decorators import cache_api_response
from api.throttling import PublicEndpointThrottle, BurstRateThrottle, SustainedRateThrottle

class KeywordsView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PublicEndpointThrottle, BurstRateThrottle, SustainedRateThrottle]

    @cache_api_response(timeout=300, cache_key_prefix="keywords")
    def get(self, request, *args, **kwargs):
        try:
            all_keywords = Keywords.objects.order_by('-id')[:30]
            seen = set()
            unique_keywords = []
            for kw in all_keywords:
                if kw.name not in seen:
                    unique_keywords.append(kw)
                    seen.add(kw.name)
                if len(unique_keywords) >= 20:
                    break

        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error fetching keywords: {str(e)}',
                'data': []
            })

        serializer = KeywordSerializer(unique_keywords, many=True)
        return Response({
            'success': True,
            'message': 'Latest 20 unique keywords fetched successfully.',
            'data': serializer.data
        })
