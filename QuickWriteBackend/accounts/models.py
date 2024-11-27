from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class CustomUser(AbstractUser):
    account_balance = models.DecimalField(max_digits=100, decimal_places=8, default=2.00)

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        # Check for low balance and create a notification if balance is below 2
        if self.pk and self.account_balance < 2:
            create_less_balance_notification(self)
        super().save(*args, **kwargs)


class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=100)
    message = models.TextField()
    link = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} notification for {self.user.username}"


# Low balance notification function
def create_less_balance_notification(user):
    """Creates a notification when the user's balance is below Ksh 2."""
    Notification.objects.create(
        user=user,
        title="Low Account Balance",
        message="Your account balance is below Ksh 2. Please top up to continue using the service.",
        link="top_up",  # Change to the appropriate link
        date_created=timezone.now()
    )


class UserSettings(models.Model):
    # Choices for default tasks
    TASK_CHOICES = [
        ('Write Email', 'Write Email'),
        ('Fill Form', 'Fill Form'),
        ('Write Review', 'Write Review'),
        ('Social Post', 'Social Post'),
        ('Summarize', 'Summarize'),
        ('Proofread & Tone', 'Proofread & Tone'),
        ('Translate', 'Translate'),
        ('Review Response', 'Review Response')
    ]

    # Choices for preferred languages
    LANGUAGE_CHOICES = [
        ('English', 'English'),
        ('Swahili', 'Swahili'),
        ('German', 'German'),
        ('French', 'French'),
        ('Spanish', 'Spanish'),
        ('Chinese', 'Chinese'),
        ('Japanese', 'Japanese')
    ]

    # Choices for preferred writing styles
    WRITING_STYLE_CHOICES = [
        ('Formal', 'Formal'),
        ('Casual', 'Casual'),
        ('Professional', 'Professional'),
        ('Friendly', 'Friendly'),
        ('Serious', 'Serious')
    ]

    user = models.OneToOneField('CustomUser', on_delete=models.CASCADE)  # Direct reference to CustomUser

    # General Settings
    default_task = models.CharField(max_length=50, choices=TASK_CHOICES, default='Write Email')
    enable_notifications = models.BooleanField(default=False)

    # Email Assistance
    enable_predefined_templates = models.BooleanField(default=False)

    # Form Assistance
    enable_auto_fill = models.BooleanField(default=False)
    form_fields_validation = models.BooleanField(default=False)

    # Summarization
    summarization_length = models.PositiveIntegerField(default=100)  # Default length for summarization

    # Translation
    preferred_language = models.CharField(max_length=50, choices=LANGUAGE_CHOICES, default='English')

    # Personalization
    preferred_writing_style = models.CharField(max_length=50, choices=WRITING_STYLE_CHOICES, default='Formal')
    save_custom_templates = models.BooleanField(default=False)

    # Accessibility Settings
    enable_text_to_speech = models.BooleanField(default=False)
    enable_speech_to_text = models.BooleanField(default=False)
    font_size = models.PositiveIntegerField(default=12)  # Default font size for accessibility

    class Meta:
        verbose_name = "User Setting"
        verbose_name_plural = "User Settings"
        ordering = ['user']  # Default ordering by user

    def __str__(self):
        return f"Settings for {self.user.username}"
