from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

user_pk = 4  # Replace with actual user ID
uidb64 = urlsafe_base64_encode(force_bytes(user_pk))
print(uidb64)
