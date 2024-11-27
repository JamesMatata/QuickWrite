from rest_framework import serializers
from .models import LNMOnline
from django.contrib.auth import get_user_model

User = get_user_model()


class LNMOnlineSerializer(serializers.ModelSerializer):
    # Including the user field and showing the username (or you can show `id` or other details)
    user = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all())

    class Meta:
        model = LNMOnline
        fields = "__all__"  # Include all fields, including the new user field
