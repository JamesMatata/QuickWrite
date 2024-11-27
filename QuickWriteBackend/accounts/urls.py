from django.urls import path, reverse_lazy
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib.auth import views as auth_views
from .views import login, logout, register, get_csrf_token, activate_account, save_settings, get_settings, \
    get_user_details, CustomPasswordResetConfirmView, CustomPasswordResetView

app_name = 'accounts'

urlpatterns = [
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('register/', register, name='register'),
    path('activate/<uidb64>/<token>/', activate_account, name='activate'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # JWT token refresh
    path('get-csrf-token/', get_csrf_token, name='get_csrf_token'),
    path('settings/save/', save_settings, name='save_settings'),
    path('settings/get/', get_settings, name='get_settings'),
    path('user/details/', get_user_details, name='user_details'),
    path(
        'reset_password/',
        CustomPasswordResetView.as_view(
            email_template_name='account/password_reset_email.html',
        ),
        name='password_reset'
    ),
    path(
        'reset/<uidb64>/<token>/',
        CustomPasswordResetConfirmView.as_view(),
        name='password_reset_confirm'
    ),
    path(
        'reset_password_complete/',
        auth_views.PasswordResetCompleteView.as_view(
            template_name='account/password_reset_complete.html'
        ),
        name='password_reset_complete'
    ),
]
