from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

User = get_user_model()


class LNMOnline(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mpesa_transactions', null=True,
                             blank=True)
    CheckoutRequestID = models.CharField(max_length=100)
    MerchantRequestID = models.CharField(max_length=50)
    ResultCode = models.IntegerField()
    ResultDesc = models.CharField(max_length=120)
    Amount = models.DecimalField(max_digits=100, decimal_places=8, default=0.00)
    MpesaReceiptNumber = models.CharField(max_length=15)
    TransactionDate = models.DateTimeField()
    PhoneNumber = models.CharField(max_length=13)

    def __str__(self):
        return self.PhoneNumber


class PayPalTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='paypal_transactions')
    payment_id = models.CharField(max_length=255)
    payer_id = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='KES')  # Default to KES but can store any currency
    status = models.CharField(max_length=50,
                              choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')])
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"PayPalTransaction(user={self.user.username}, payment_id={self.payment_id}, amount={self.amount})"


class MpesaPaymentRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELED', 'Canceled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    phone_number = models.CharField(max_length=15)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    mpesa_receipt_number = models.CharField(max_length=50, blank=True, null=True)
    transaction_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment of {self.amount} KES by {self.user} - Status: {self.status}"

    # Method to check if the payment request has expired and mark as canceled
    def check_and_cancel(self):
        if self.status == 'PENDING' and timezone.now() > self.created_at + timedelta(minutes=3):
            self.status = 'CANCELED'
            self.save()

    @classmethod
    def cancel_expired_requests(cls):
        # Check all requests that are still pending and older than 3 minutes
        expired_requests = cls.objects.filter(status='PENDING', created_at__lt=timezone.now() - timedelta(minutes=3))
        for request in expired_requests:
            request.check_and_cancel()
