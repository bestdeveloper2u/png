import time
import logging
from django.core.cache import cache
from django.http import JsonResponse
from django.conf import settings

logger = logging.getLogger(__name__)


def is_cache_available():
    try:
        cache.set('_cache_test', 'test', 1)
        return cache.get('_cache_test') == 'test'
    except Exception:
        return False


class DDoSProtectionMiddleware:
    RATE_LIMIT_WINDOW = 60
    MAX_REQUESTS_PER_WINDOW = getattr(settings, 'DDOS_MAX_REQUESTS', 120)
    BLOCK_DURATION = getattr(settings, 'DDOS_BLOCK_DURATION', 300)
    SUSPICIOUS_THRESHOLD = getattr(settings, 'DDOS_SUSPICIOUS_THRESHOLD', 100)

    def __init__(self, get_response):
        self.get_response = get_response
        self._cache_available = None

    def _check_cache(self):
        if self._cache_available is None:
            self._cache_available = is_cache_available()
        return self._cache_available

    def __call__(self, request):
        if not self._check_cache():
            return self.get_response(request)
        
        try:
            client_ip = self.get_client_ip(request)
            
            if self.is_blocked(client_ip):
                logger.warning(f"Blocked request from IP: {client_ip}")
                return JsonResponse({
                    'success': False,
                    'message': 'Too many requests. Please try again later.',
                    'error': 'rate_limited'
                }, status=429)
            
            if self.is_rate_limited(client_ip):
                self.block_ip(client_ip)
                logger.warning(f"Rate limiting and blocking IP: {client_ip}")
                return JsonResponse({
                    'success': False,
                    'message': 'Too many requests. You have been temporarily blocked.',
                    'error': 'rate_limited'
                }, status=429)
            
            self.increment_request_count(client_ip)
        except Exception as e:
            logger.debug(f"DDoS protection skipped due to cache error: {e}")
        
        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        trust_proxy = getattr(settings, 'TRUST_PROXY_HEADERS', False)
        trusted_proxies = getattr(settings, 'TRUST_PROXY_IPS', []) or []
        remote_addr = request.META.get('REMOTE_ADDR')

        if trust_proxy and (not trusted_proxies or remote_addr in trusted_proxies):
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                return x_forwarded_for.split(',')[0].strip()
            real_ip = request.META.get('HTTP_X_REAL_IP')
            if real_ip:
                return real_ip

        return remote_addr or '127.0.0.1'

    def get_cache_key(self, ip, suffix='count'):
        return f"ddos:{suffix}:{ip}"

    def is_blocked(self, ip):
        block_key = self.get_cache_key(ip, 'blocked')
        return cache.get(block_key) is not None

    def block_ip(self, ip):
        block_key = self.get_cache_key(ip, 'blocked')
        cache.set(block_key, True, self.BLOCK_DURATION)

    def is_rate_limited(self, ip):
        count_key = self.get_cache_key(ip, 'count')
        request_count = cache.get(count_key, 0)
        return request_count >= self.MAX_REQUESTS_PER_WINDOW

    def increment_request_count(self, ip):
        count_key = self.get_cache_key(ip, 'count')
        try:
            current_count = cache.get(count_key)
            if current_count is None:
                cache.set(count_key, 1, self.RATE_LIMIT_WINDOW)
            else:
                cache.incr(count_key)
        except Exception:
            cache.set(count_key, 1, self.RATE_LIMIT_WINDOW)


class RequestSizeLimitMiddleware:
    MAX_CONTENT_LENGTH = 25 * 1024 * 1024

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        content_length = request.META.get('CONTENT_LENGTH')
        if content_length:
            try:
                if int(content_length) > self.MAX_CONTENT_LENGTH:
                    return JsonResponse({
                        'success': False,
                        'message': 'Request too large.',
                        'error': 'payload_too_large'
                    }, status=413)
            except (ValueError, TypeError):
                pass
        
        return self.get_response(request)


class SecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        if request.is_secure():
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
        
        return response
