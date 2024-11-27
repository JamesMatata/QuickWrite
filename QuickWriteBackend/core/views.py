import base64

import paypalrestsdk
import requests
from datetime import datetime

from django.http import JsonResponse
from django.shortcuts import render
from paypalrestsdk import Payment
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from QuickWrite import settings
from QuickWrite.settings import MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET
from accounts.models import Notification
from .models import LNMOnline, PayPalTransaction, MpesaPaymentRequest
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.response import Response

from .serializers import LNMOnlineSerializer

from rest_framework.decorators import api_view, permission_classes

from decimal import Decimal, ROUND_HALF_UP
from django.utils import timezone  # Add this import to handle timezone

import tiktoken

User = get_user_model()


# 1. Generate Password and Timestamp for M-Pesa STK Push
def generate_password(shortcode, passkey):
    """
    Generates a password and timestamp for M-Pesa authentication.

    Args:
        shortcode (str): The business shortcode.
        passkey (str): The M-Pesa passkey.

    Returns:
        tuple: A tuple containing the encoded password and the formatted timestamp, or (None, None) if an error occurs.
    """
    try:
        unformatted_time = datetime.now()
        formatted_time = unformatted_time.strftime("%Y%m%d%H%M%S")
        data_to_encode = shortcode + passkey + formatted_time
        encoded_string = base64.b64encode(data_to_encode.encode())
        decoded_password = encoded_string.decode('utf-8')
        return decoded_password, formatted_time
    except Exception:
        return None, None


# 2. Generate Access Token for M-Pesa API
def generate_access_token(consumer_key_p, consumer_secret_p):
    """
    Generates an access token using the provided consumer key and secret.

    Args:
        consumer_key_p (str): The consumer key.
        consumer_secret_p (str): The consumer secret.

    Returns:
        str or None: The access token if successful, None otherwise.
    """
    token_url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    credentials = f"{consumer_key_p}:{consumer_secret_p}"
    base64_credentials = base64.b64encode(credentials.encode()).decode()
    headers = {'Authorization': f'Basic {base64_credentials}'}

    try:
        response = requests.get(token_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        access_token = data.get('access_token')
        if not access_token:
            raise ValueError("Failed to obtain access token.")
        return access_token

    except requests.exceptions.RequestException:
        return None
    except ValueError:
        return None
    except Exception:
        return None


# 3. Lipa na M-Pesa Function to Initiate Payment
def lipa_na_mpesa(amount, phone_number, user_id):
    """
    Initiates the Lipa na M-Pesa process for the specified amount and phone number.

    Args:
        amount (float): Amount to be paid.
        phone_number (str): User's phone number.
        user_id (int): ID of the user initiating the payment.

    Returns:
        dict or None: Response from M-Pesa API if successful, None otherwise.
    """
    try:
        # Generate the access token
        access_token = generate_access_token(MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET)
        if not access_token:
            raise ValueError("Invalid access token.")

        # Generate password and timestamp
        decoded_password, formatted_time = generate_password(MPESA_SHORTCODE, MPESA_PASSKEY)
        if not decoded_password or not formatted_time:
            raise ValueError("Failed to generate password or timestamp.")

        # Remove '+' from phone number if present
        if phone_number.startswith('+'):
            phone_number = phone_number[1:]

        # Save the payment request as Pending
        user = User.objects.get(id=user_id)
        payment = MpesaPaymentRequest.objects.create(
            user=user,
            amount=amount,
            phone_number=phone_number,
            status='PENDING',
        )
        payment.save()

        # Set up API request
        api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {"Authorization": f"Bearer {access_token}"}
        pay_request = {
            "BusinessShortCode": MPESA_SHORTCODE,
            "Password": decoded_password,
            "Timestamp": formatted_time,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": MPESA_SHORTCODE,
            "PhoneNumber": phone_number,
            "CallBackURL": "https://0712-41-89-22-3.ngrok-free.app/core/mpesa-callback/",
            "AccountReference": 'QuickWrite',
            "TransactionDesc": f"Payment for user {user_id}",
        }

        # Send API request
        response = requests.post(api_url, json=pay_request, headers=headers)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException:
        return None
    except ValueError:
        return None
    except Exception:
        return None


# 4. Top-up View to Handle Payment Request from Frontend
@api_view(['POST'])
def topup(request):
    """
    Handles top-up requests by initiating an M-Pesa payment.

    Args:
        request: The HTTP request containing user and payment details.

    Returns:
        Response: A DRF Response object indicating success or failure.
    """
    try:
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        phone_number = data.get('phone_number')
        amount = data.get('amount')

        if not phone_number or not phone_number.startswith("254") or len(phone_number) != 12:
            return Response({'error': 'Invalid phone number format. It should be 254XXXXXXXXX'},
                            status=status.HTTP_400_BAD_REQUEST)

        if not amount or int(amount) <= 0:
            return Response({'error': 'Invalid amount. It should be greater than zero.'},
                            status=status.HTTP_400_BAD_REQUEST)

        user_id = user.id  # Extract user ID

        # Call lipa_na_mpesa function to initiate the payment
        payment_response = lipa_na_mpesa(amount, phone_number, user_id)

        if payment_response and payment_response.get('ResponseCode') == '0':
            return Response({'status': 'success', 'message': 'Payment initiated successfully'},
                            status=status.HTTP_200_OK)
        else:
            error_message = payment_response.get('errorMessage', 'Failed to initiate payment')
            return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LNMCallbackUrlAPIView(CreateAPIView):
    queryset = LNMOnline.objects.all()
    serializer_class = LNMOnlineSerializer

    def create(self, request, *args, **kwargs):
        try:
            # Extract primary fields from the callback request
            stk_callback = request.data['Body']['stkCallback']
            merchant_request_id = stk_callback['MerchantRequestID']
            checkout_request_id = stk_callback['CheckoutRequestID']
            result_code = stk_callback['ResultCode']
            result_description = stk_callback['ResultDesc']

            # Extracting fields from CallbackMetadata
            callback_metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
            amount = None
            mpesa_receipt_number = None
            transaction_date = None
            phone_number = None
            user_id = None  # user_id might not be in the callback, so we will use AccountReference

            # Iterate through CallbackMetadata and fetch relevant fields
            for item in callback_metadata:
                name = item.get('Name')
                value = item.get('Value')
                if name == 'Amount':
                    amount = value
                elif name == 'MpesaReceiptNumber':
                    mpesa_receipt_number = value
                elif name == 'TransactionDate':
                    transaction_date = value
                elif name == 'PhoneNumber':
                    phone_number = value

            # Check if all necessary fields are present
            if all([amount, mpesa_receipt_number, transaction_date, phone_number]):
                # Safely convert the amount to Decimal
                amount = Decimal(int(amount))

                # Convert the transaction date to datetime and make it timezone-aware
                transaction_datetime = datetime.strptime(str(transaction_date), "%Y%m%d%H%M%S")
                transaction_datetime = timezone.make_aware(transaction_datetime)

                # Fetch the payment request by phone number
                payment_request = MpesaPaymentRequest.objects.filter(phone_number=phone_number, amount=amount,
                                                                     status='PENDING').last()

                if not payment_request:
                    return Response({"status": "Failed", "message": "Payment request not found"},
                                    status=status.HTTP_404_NOT_FOUND)

                # Check the result code and update status
                if result_code == 0:  # Success
                    payment_request.status = 'CONFIRMED'
                    # You can update the user balance here if necessary
                else:  # Failure
                    payment_request.status = 'CANCELED'

                # Save the payment request status
                payment_request.mpesa_receipt_number = mpesa_receipt_number
                payment_request.save()

                # Fetch the user
                try:
                    user = payment_request.user
                except User.DoesNotExist:
                    return Response({"status": "Failed", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

                # Save the transaction in LNMOnline
                transaction = LNMOnline.objects.create(
                    user=user,
                    CheckoutRequestID=checkout_request_id,
                    MerchantRequestID=merchant_request_id,
                    ResultCode=result_code,
                    ResultDesc=result_description,
                    Amount=amount,
                    MpesaReceiptNumber=mpesa_receipt_number,
                    TransactionDate=transaction_datetime,
                    PhoneNumber=phone_number
                )
                transaction.save()

                # Update the user's account balance
                user.account_balance += amount
                user.save()

                return Response({"status": "Success", "message": f"Amount {amount} added to account balance"},
                                status=status.HTTP_201_CREATED)
            else:
                return Response({"status": "Failed", "message": "Timed Out or Canceled"},
                                status=status.HTTP_400_BAD_REQUEST)

        except KeyError as e:
            return Response({"status": "Failed", "message": f"Missing field: {e}"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"status": "Failed", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


def calculate_tokens(text):
    # Get encoding for the model gpt-3.5-turbo
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
    # Encode the text and return the number of tokens
    return len(encoding.encode(text))


@api_view(['POST'])
def charge_tokens(request):
    try:
        dollar_to_ksh = 127
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        # Extract the input and output texts from the request data
        texts_data = request.data
        input_text = texts_data.get('inputText')
        output_text = texts_data.get('outputText')

        if not input_text or not output_text:
            return Response({'error': 'Both inputText and outputText are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Calculate the number of tokens for input and output
        input_tokens = calculate_tokens(input_text)
        output_tokens = calculate_tokens(output_text)

        # Total tokens used
        total_tokens = input_tokens + output_tokens

        # Convert the cost per token to Decimal and calculate total cost as Decimal
        cost_per_token = Decimal('0.000003')  # Use string to ensure precision
        total_cost = Decimal(total_tokens) * cost_per_token * Decimal(dollar_to_ksh)

        # Check if the user has enough balance to cover the token cost
        if user.account_balance >= total_cost:
            user.account_balance -= total_cost
            user.save()

            # Return the updated balance in the response
            return Response({
                'message': 'Tokens charged successfully.',
                'new_balance': str(user.account_balance)  # Return the new balance as a string for compatibility
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_notifications(request):
    user = request.user  # Assuming the user is already authenticated
    try:
        # Fetch all notifications for the authenticated user
        notifications = Notification.objects.filter(user=user)
        notifications_data = [
            {
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'link': notification.link,
                'dateCreated': notification.date_created,
                'isRead': notification.is_read,
            }
            for notification in notifications
        ]
        return Response(notifications_data, status=200)
    except Notification.DoesNotExist:
        return Response({"error": "No notifications found."}, status=404)


@api_view(['DELETE'])
def delete_notification(request, notification_id):
    user = request.user  # Assuming the user is already authenticated
    try:
        # Fetch the notification by ID and ensure it belongs to the authenticated user
        notification = Notification.objects.get(id=notification_id, user=user)
        notification.delete()  # Delete the notification
        return Response({"message": "Notification deleted successfully."}, status=200)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found."}, status=404)


@api_view(['PATCH'])  # Use PATCH for partial updates
def mark_notification_as_read(request, notification_id):
    user = request.user  # Assuming the user is authenticated
    try:
        # Find the notification for the authenticated user and update it
        notification = Notification.objects.get(id=notification_id, user=user)
        notification.is_read = True
        notification.save()  # Update the database
        return Response({"message": "Notification marked as read."}, status=200)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found."}, status=404)


# PayPal SDK configuration
paypalrestsdk.configure({
    "mode": settings.PAYPAL_ENV,  # 'sandbox' or 'live'
    "client_id": settings.PAYPAL_CLIENT_ID,
    "client_secret": settings.PAYPAL_CLIENT_SECRET,
})


@csrf_exempt
@api_view(['POST'])
def paypal_topup(request):
    try:
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        # Get the amount from the request
        data = request.data
        amount = data.get('amount')

        amount_usd = str((Decimal(amount) / 129).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))

        if not amount_usd or float(amount_usd) <= 0:
            return Response({'error': 'Invalid amount. It should be greater than zero.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Create a PayPal payment
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "transactions": [{
                "amount": {
                    "total": amount_usd,
                    "currency": "USD"  # Use your preferred currency
                },
                "description": f"PayPal top-up for user {user.username}"
            }],
            "redirect_urls": {
                "return_url": f"http://localhost:8000/api/paypal/capture/?user_id={user.id}",  # Success URL
                "cancel_url": "http://localhost:8000/api/paypal/cancel"  # Cancel URL
            }
        })

        if payment.create():
            # Find the approval_url to redirect the user
            for link in payment.links:
                if link.rel == "approval_url":
                    approval_url = link.href
                    return Response({"approval_url": approval_url}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Failed to create PayPal payment'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def capture_paypal_topup(request):
    message = ""  # Initialize an empty message for displaying to the user

    try:
        payment_id = request.GET.get('paymentId')
        payer_id = request.GET.get('PayerID')
        user_id = request.GET.get('user_id')  # Get user ID from return URL
        user = User.objects.get(id=user_id)

        if not payment_id or not payer_id:
            message = 'Invalid payment or payer ID.'
            return render(request, 'result.html', {'message': message})

        # Find the payment by payment ID
        payment = Payment.find(payment_id)

        # Execute the payment
        if payment.execute({"payer_id": payer_id}):
            # Payment successful, get the amount and currency
            amount = payment.transactions[0].amount.total
            currency = payment.transactions[0].amount.currency

            # Convert USD amount to KES
            amount_kes = Decimal(Decimal(amount) * 129).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

            # Update the user's account balance
            user.account_balance += amount_kes
            user.save()

            # Save the transaction details
            PayPalTransaction.objects.create(
                user=user,
                payment_id=payment_id,
                payer_id=payer_id,
                amount=amount_kes,
                currency='KES',
                status='completed'
            )

            message = f"Payment of {amount} {currency} was successfully captured. Your account has been credited with {amount_kes} KES."
            return render(request, 'result.html', {'message': message})
        else:
            # Handle payment failure
            PayPalTransaction.objects.create(
                user=user,
                payment_id=payment_id,
                payer_id=payer_id,
                amount=0,  # Failed payment will have 0 amount
                status='failed'
            )
            message = "Payment failed. Please try again."
            return render(request, 'result.html', {'message': message})

    except Exception as e:
        message = f"An error occurred: {str(e)}"
        return render(request, 'result.html', {'message': message})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def call_openai(request):
    print(request.data)
    try:
        # Parse data from the request
        data = request.data
        selected_task = data.get('task')
        input_text = data.get('input')
        tone = data.get('tone')
        language = data.get('language')
        summarization_length = data.get('summarizationLength', 100)

        # Create messages for OpenAI based on the task
        messages = []
        if selected_task == "Summarize":
            messages.append({"role": "user",
                             "content": f"Summarize this text in {summarization_length} words: {input_text}. Keep it brief."})
        elif selected_task == "Translate":
            if not language:
                return JsonResponse({"error": "Specify the target language"}, status=400)
            messages.append({"role": "user", "content": f"Translate this to {language}: {input_text}."})
        elif selected_task == "Proofread & Tone":
            messages.append(
                {"role": "user", "content": f"Proofread and adjust to a {tone} tone: {input_text}. Keep it short."})
        elif selected_task == "Write Email":
            messages.append({"role": "user", "content": f"Write a brief email in a {tone} tone: {input_text}."})
        elif selected_task == "Fill Form":
            messages.append({"role": "user",
                             "content": f"Improve this response while keeping it short and written in {summarization_length} characters and a {tone} tone: \"{input_text}\". Keep the focus on clarity."})
        elif selected_task == "Write Review":
            messages.append({"role": "user", "content": f"Write a brief review in a {tone} tone: {input_text}."})
        elif selected_task == "Social Post":
            messages.append(
                {"role": "user", "content": f"Write a social post in a {tone} tone using this: {input_text}."})
        elif selected_task == "Review Respond":
            messages.append({"role": "user",
                             "content": f"Write a brief review response in a {tone} tone to the following review: {input_text}."})
        else:
            return JsonResponse({"error": "Task not implemented."}, status=400)
        # Request body for OpenAI
        request_body = {
            "model": "gpt-3.5-turbo",
            "messages": messages,
            "max_tokens": 100,
            "temperature": 0.5,
        }

        # Send the request to OpenAI API
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Authorization': f"Bearer {settings.OPENAI_API_KEY}",
                'Content-Type': 'application/json',
            },
            json=request_body,
        )

        if response.status_code != 200:
            return JsonResponse({"error": f"{response.status_code} - {response.reason}"}, status=response.status_code)

        # Return the response from OpenAI
        data = response.json()
        output = data['choices'][0]['message']['content'].strip()
        print(output)
        return JsonResponse({"output": output})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
