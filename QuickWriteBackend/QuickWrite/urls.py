from django.contrib import admin
from django.urls import path, include

admin.site.site_title = 'Admin | QuickWrite'
admin.site.site_header = 'Admin | QuickWrite'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('core/', include('core.urls', namespace='core')),
    path('accounts/', include('accounts.urls', namespace='accounts')),
]
