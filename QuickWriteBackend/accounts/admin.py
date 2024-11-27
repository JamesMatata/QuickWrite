from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from accounts.models import CustomUser, UserSettings, Notification


class CustomUserAdmin(UserAdmin):
    model = CustomUser

    # Define which fields to display in the user list
    list_display = ['username', 'email', 'first_name', 'last_name', 'account_balance', 'is_staff', 'is_active']

    # Add filters for quick access
    list_filter = ['is_staff', 'is_active', 'date_joined']

    # Add a search bar to quickly find users by username, email, or name
    search_fields = ['username', 'email', 'first_name', 'last_name']

    # Group the fields into sections for better organization
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal Info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Account Info'), {'fields': ('account_balance',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important Dates'), {'fields': ('last_login', 'date_joined')}),
    )

    # Define which fields to display when adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'password1', 'password2', 'email', 'first_name', 'last_name', 'account_balance', 'is_staff',
                'is_active')}
         ),
    )

    # Enable inline editing for users
    ordering = ['username']  # Default ordering by username

    # Number of records per page in the user list
    list_per_page = 20


# Register the CustomUser model with the enhanced CustomUserAdmin class
admin.site.register(CustomUser, CustomUserAdmin)

admin.site.register(UserSettings)

admin.site.register(Notification)
