from django.contrib import admin

from core.models import LNMOnline, PayPalTransaction, MpesaPaymentRequest

admin.site.register(LNMOnline)

admin.site.register(PayPalTransaction)

admin.site.register(MpesaPaymentRequest)
