# Razorpay Integration Guide

## 1. Environment Setup

Add the following to your `backend/.env` file:
```
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

## 2. API Endpoints

### Create Order
**POST** `/api/order/razorpay`
Headers: `token: <jwt>`
Body:
```json
{
    "items": [...],
    "amount": 500,
    "address": {...}
}
```
Response:
```json
{
    "success": true,
    "order": {
        "id": "order_N...",
        "entity": "order",
        "amount": 50000,
        "amount_paid": 0,
        "amount_due": 50000,
        "currency": "INR",
        "receipt": "mongo_order_id",
        "status": "created",
        "attempts": 0,
        "notes": [],
        "created_at": 171...
    }
}
```

### Verify Payment
**POST** `/api/order/verifyRazorpay`
Headers: `token: <jwt>`
Body:
```json
{
    "razorpay_order_id": "order_N...",
    "razorpay_payment_id": "pay_N...",
    "razorpay_signature": "..."
}
```
Response:
```json
{
    "success": true,
    "message": "Payment Successful"
}
```

## 3. Postman Test Steps

1. **Login** to get Token.
2. **Call `/api/order/razorpay`**:
   - Save `order.id` as `razorpay_order_id`.
   - Save `order.receipt` (optional, internal verification).
3. **Mock Payment (Frontend/Postman)**:
   - In real scenario, Razorpay checkout handles this.
   - For Postman, you need valid `razorpay_payment_id` and `signature`.
   - NOTE: **You cannot easily generate a valid signature in Postman without a script.**
   - **Workaround:**
     - Use Razorpay Dashboard > Test Mode to simulate success if testing webhooks.
     - OR write a small Node script to generate HMAC signature using your SECRET.

User flow remains secure as signature verification ensures `payment_id` matches `order_id`.
