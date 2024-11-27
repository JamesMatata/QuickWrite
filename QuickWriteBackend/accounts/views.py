import json
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated

from .models import Notification, UserSettings
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse_lazy
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.shortcuts import redirect, render
from django.template.loader import render_to_string

from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
import logging

from .tokens import account_activation_token

from rest_framework.decorators import api_view, permission_classes

from django.utils.http import urlsafe_base64_decode
from django.utils import timezone

User = get_user_model()

logging.basicConfig(level=logging.DEBUG)


def getUserSettings(user_id):
    try:
        # Get the user based on the provided user ID
        user = User.objects.get(id=user_id)

        # Get the user's settings
        user_settings = UserSettings.objects.get(user=user)

        # Create a dictionary with the settings to return as JSON
        settings = {
            "default_task": user_settings.default_task,
            "enable_notifications": user_settings.enable_notifications,
            "enable_predefined_templates": user_settings.enable_predefined_templates,
            "enable_auto_fill": user_settings.enable_auto_fill,
            "form_fields_validation": user_settings.form_fields_validation,
            "summarization_length": user_settings.summarization_length,
            "preferred_language": user_settings.preferred_language,
            "preferred_writing_style": user_settings.preferred_writing_style,
            "save_custom_templates": user_settings.save_custom_templates,
            "enable_text_to_speech": user_settings.enable_text_to_speech,
            "enable_speech_to_text": user_settings.enable_speech_to_text,
            "font_size": user_settings.font_size,
        }

        return JsonResponse(settings)  # Send as JSON response

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except UserSettings.DoesNotExist:
        return JsonResponse({"error": "User settings not found"}, status=404)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        # Create refresh and access tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def get_user_details(request):
    user = request.user  # This will get the user based on the JWT token

    # Prepare user data for the response
    user_data = {
        "full_name": f"{user.first_name} {user.last_name}",
        "username": user.username,
        "email": user.email,
        "account_balance": getattr(user, 'account_balance', 0),  # Assuming `account_balance` exists, default to 0
    }

    return Response(user_data, status=200)


@api_view(['POST'])
def logout(request):
    try:
        # Blacklist the refresh token to invalidate it
        token = request.data.get('refresh')
        if token:
            RefreshToken(token).blacklist()
        return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register(request):
    first_name = request.data.get('first_name')  # Get first name directly
    last_name = request.data.get('last_name')  # Get last name directly
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    # Validate input
    if not username or not email or not password:
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the username already exists
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the email already exists
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Create user with first and last name directly
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        user.is_active = False  # Deactivate account until email is confirmed
        user.save()

        # Send confirmation email
        current_site = get_current_site(request)
        subject = 'Activate Your Account'
        message = render_to_string('account/activation_email.html', {
            'user': user,
            'domain': current_site.domain,  # Use the domain from the current site
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': account_activation_token.make_token(user),
        })
        email_message = EmailMessage(subject, message, to=[email])
        email_message.content_subtype = "html"
        email_message.send()

        return Response({"message": "User registered successfully. Please check your email to confirm your account."},
                        status=status.HTTP_201_CREATED)

    except Exception as e:
        # Log the error (optional)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Welcome notification function
def create_welcome_notification(user):
    """Creates a welcome notification for a new user."""
    Notification.objects.create(
        user=user,
        title="Welcome to QuickWrite!",
        message="Welcome! You have been credited with Ksh 10 to get started. Enjoy our services!",
        link="account_dashboard",
        date_created=timezone.now()
    )


def handle_user_activation(instance):
    # Update account balance to Ksh 10
    instance.account_balance = 10
    instance.save()  # Save the updated balance

    # Create the welcome notification
    create_welcome_notification(instance)


def activate_account(request, uidb64, token):
    message = ""  # Initialize an empty message

    try:
        # Decode the uidb64 to get the user ID
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)  # Fetch the user

        # Check if the token is valid
        if account_activation_token.check_token(user, token):
            if user.is_active:
                message = "Your account is already activated."
            else:
                # Activate the user account
                user.is_active = True
                user.save()

                # Initialize user settings after account activation
                # Create default settings for the user if not already created
                UserSettings.objects.get_or_create(user=user)

                message = "Your account has been activated successfully!"

                # You can also trigger additional actions like sending a welcome email
                handle_user_activation(user)
        else:
            message = "Activation link is invalid or expired."

    except (TypeError, ValueError, OverflowError):
        message = "Invalid activation link. Please check your link and try again."
    except User.DoesNotExist:
        message = "No user associated with this activation link."

    return render(request, 'result.html', {'message': message})


@csrf_exempt  # Temporarily disable CSRF protection for this view
def get_csrf_token(request):
    csrf_token = get_token(request)  # Generates a new CSRF token
    return JsonResponse({'csrfToken': csrf_token})


@api_view(['POST'])
def save_settings(request):
    user = request.user  # Assuming the user is already authenticated
    settings_data = request.data

    # Get or create user settings
    user_settings, created = UserSettings.objects.get_or_create(user=user)

    # Update settings based on the incoming data
    user_settings.default_task = settings_data.get('defaultTask',
                                                   user_settings.default_task) or 'Write Email'  # Default if blank
    user_settings.enable_notifications = settings_data.get('enableNotifications', user_settings.enable_notifications)
    user_settings.enable_predefined_templates = settings_data.get('preDefinedTemplates',
                                                                  user_settings.enable_predefined_templates)
    user_settings.enable_auto_fill = settings_data.get('enableAutoFill', user_settings.enable_auto_fill)
    user_settings.form_fields_validation = settings_data.get('formFieldsValidation',
                                                             user_settings.form_fields_validation)
    user_settings.summarization_length = settings_data.get('summarizationLength',
                                                           user_settings.summarization_length) or 100  # Default if blank
    user_settings.preferred_language = settings_data.get('preferredLanguage',
                                                         user_settings.preferred_language) or 'English'  # Default if blank
    user_settings.preferred_writing_style = settings_data.get('preferredWritingStyle',
                                                              user_settings.preferred_writing_style) or 'Formal'  # Default if blank
    user_settings.save_custom_templates = settings_data.get('saveCustomTemplates', user_settings.save_custom_templates)
    user_settings.enable_text_to_speech = settings_data.get('enableTextToSpeech', user_settings.enable_text_to_speech)
    user_settings.enable_speech_to_text = settings_data.get('enableSpeechToText', user_settings.enable_speech_to_text)
    user_settings.font_size = settings_data.get('fontSize', user_settings.font_size) or 12  # Default if blank

    user_settings.save()  # Save the updated settings to the database

    return Response({'message': 'Settings saved successfully.'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_settings(request):
    user = request.user  # Assuming the user is already authenticated
    try:
        user_settings = UserSettings.objects.get(user=user)
        settings_data = {
            'defaultTask': user_settings.default_task,
            'enableNotifications': user_settings.enable_notifications,
            'preDefinedTemplates': user_settings.enable_predefined_templates,
            'enableAutoFill': user_settings.enable_auto_fill,
            'formFieldsValidation': user_settings.form_fields_validation,
            'summarizationLength': user_settings.summarization_length,
            'preferredLanguage': user_settings.preferred_language,
            'preferredWritingStyle': user_settings.preferred_writing_style,
            'saveCustomTemplates': user_settings.save_custom_templates,
            'enableTextToSpeech': user_settings.enable_text_to_speech,
            'enableSpeechToText': user_settings.enable_speech_to_text,
            'fontSize': user_settings.font_size,
        }
        return Response(settings_data, status=200)
    except UserSettings.DoesNotExist:
        return Response({"error": "Settings not found."}, status=404)


@method_decorator(csrf_exempt, name='dispatch')
class CustomPasswordResetView(PasswordResetView):
    email_template_name = 'account/password_reset_email.html'
    token_generator = default_token_generator
    from_email = settings.DEFAULT_FROM_EMAIL

    def post(self, request, *args, **kwargs):
        # Parse JSON data from the request body
        data = json.loads(request.body)
        email = data.get("email")

        # Check if the email was provided
        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)

        # Find users associated with the provided email
        associated_users = User.objects.filter(email=email)

        if not associated_users.exists():
            return JsonResponse({"error": "No user is associated with this email address"}, status=404)

        # Send reset emails
        for user in associated_users:
            self.send_reset_email(user)

        return JsonResponse({"success": "Password reset link has been sent to your email."})

    def send_reset_email(self, user):
        current_site = get_current_site(self.request)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = self.token_generator.make_token(user)

        # Set a static subject for the password reset email
        subject = 'Reset Your Password'

        # Render the email message using the password reset email template
        message = render_to_string('account/password_reset_email.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': uid,
            'token': token,
            'protocol': 'https' if self.request.is_secure() else 'http',
        })

        # Create the email message
        email = EmailMessage(subject, message, to=[user.email])
        email.content_subtype = "html"  # Set the main content type to text/html
        email.send()


class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name = 'account/password_reset_confirm.html'
    success_url = reverse_lazy('accounts:password_reset_complete')
    token_generator = default_token_generator

    def get_user(self, uidb64):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        return user

    def form_valid(self, form):
        user = self.get_user(self.kwargs['uidb64'])
        if user is not None:
            password1 = form.cleaned_data.get('new_password1')
            password2 = form.cleaned_data.get('new_password2')

            # Check if passwords match
            if password1 != password2:
                messages.error(self.request, 'The two passwords do not match.')
                return self.form_invalid(form)

            # Check if password is at least 8 characters long
            if len(password1) < 8:
                messages.error(self.request, 'Password should be at least 8 characters.')
                return self.form_invalid(form)

            # If all checks pass, save the new password
            user.set_password(password1)
            user.save()

            messages.success(self.request, 'Your password has been set. You may go ahead and log in.')
            return super().form_valid(form)
        else:
            messages.error(self.request, 'The reset link is invalid or has expired.')
            return redirect('accounts:password_reset')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['validlink'] = self.get_user(self.kwargs['uidb64']) is not None
        return context
