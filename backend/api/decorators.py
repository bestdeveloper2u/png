import hashlib
import json
from functools import wraps
from django.core.cache import cache
from rest_framework.response import Response


def cache_api_response(timeout=300, cache_key_prefix=None, vary_on_user=False):
    """
    Decorator to cache API responses in Redis.
    
    Args:
        timeout: Cache timeout in seconds (default: 300 = 5 minutes)
        cache_key_prefix: Custom prefix for cache key (default: view function name)
        vary_on_user: If True, cache will vary by authenticated user
    
    Returns:
        Cached response or fresh response if not cached
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(self, request, *args, **kwargs):
            # Build cache key from request path and query parameters
            prefix = cache_key_prefix or view_func.__name__
            
            # Sort query params for consistent cache keys
            query_params = dict(sorted(request.query_params.items()))
            params_str = json.dumps(query_params, sort_keys=True)
            
            # Create hash of params for shorter key
            params_hash = hashlib.md5(params_str.encode()).hexdigest()
            
            # Build full cache key
            cache_key = f"api:{prefix}:{request.path}:{params_hash}"
            
            # Optionally vary by user
            if vary_on_user and request.user.is_authenticated:
                cache_key = f"{cache_key}:user:{request.user.id}"
            
            # Include any URL kwargs (like slugs, pks)
            if kwargs:
                kwargs_str = json.dumps(kwargs, sort_keys=True, default=str)
                kwargs_hash = hashlib.md5(kwargs_str.encode()).hexdigest()
                cache_key = f"{cache_key}:{kwargs_hash}"
            
            # Try to get cached response
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                return Response(cached_data)
            
            # Call the actual view
            response = view_func(self, request, *args, **kwargs)
            
            # Only cache successful responses
            if response.status_code == 200:
                cache.set(cache_key, response.data, timeout)
            
            return response
        
        return wrapper
    return decorator


def invalidate_cache_prefix(prefix):
    """
    Invalidate all cache keys matching a prefix pattern.
    Uses Redis SCAN to find and delete matching keys.
    
    Args:
        prefix: The cache key prefix to invalidate
    """
    from django_redis import get_redis_connection
    
    try:
        redis_client = get_redis_connection("default")
        # Get the full key prefix (including Django cache prefix)
        full_prefix = f"pngpoint:1:api:{prefix}*"
        
        # Use SCAN to find all matching keys
        cursor = 0
        deleted_count = 0
        while True:
            cursor, keys = redis_client.scan(cursor, match=full_prefix, count=100)
            if keys:
                redis_client.delete(*keys)
                deleted_count += len(keys)
            if cursor == 0:
                break
        
        return deleted_count
    except Exception:
        # Fallback: if Redis connection fails, just return 0
        return 0


def invalidate_cache_key(cache_key):
    """
    Invalidate a specific cache key.
    
    Args:
        cache_key: The specific cache key to delete
    """
    return cache.delete(cache_key)
