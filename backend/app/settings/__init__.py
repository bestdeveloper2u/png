###################################################
"""
Settings entrypoint.

The development settings module has been removed. Use
`app.settings.prod` for all environments and override values
with environment variables as needed.
"""
###################################################

# Always load production settings; fall back here if DJANGO_SETTINGS_MODULE
# points to app.settings.
from app.settings.prod import *
