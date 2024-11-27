from django.urls import path
from .views import charge_tokens, topup, LNMCallbackUrlAPIView, get_notifications, delete_notification, \
    mark_notification_as_read, paypal_topup, capture_paypal_topup, call_openai

app_name = 'core'

urlpatterns = [
    path('charge-tokens/', charge_tokens, name='charge_tokens'),
    path('topup/', topup, name='topup'),  # URL for the top-up function
    path('mpesa-callback/', LNMCallbackUrlAPIView.as_view(), name='mpesa_callback'),
    path('notifications/', get_notifications, name='get_notifications'),
    path('delete_notification/<int:notification_id>/', delete_notification, name='delete_notification'),
    path('notifications/<int:notification_id>/mark_as_read/', mark_notification_as_read, name='mark_notification_as_read'),
    path('paypal/topup/', paypal_topup, name='paypal_topup'),
    path('paypal/capture/', capture_paypal_topup, name='capture_paypal_topup'),
    path('call_openai', call_openai, name='call_openai'),
]
