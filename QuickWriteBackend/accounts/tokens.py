from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str  # Use force_str instead of force_text
from six import text_type


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return text_type(user.pk) + text_type(timestamp) + text_type(user.is_active)


account_activation_token = AccountActivationTokenGenerator()
