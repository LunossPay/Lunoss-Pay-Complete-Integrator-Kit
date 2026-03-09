# Lunoss Pay — Quick Start Guide

Get from zero to your first confirmed payment in under 5 minutes.

---

## Step 1 — Create an Account

1. Go to [app.lunosspay.com](https://app.lunosspay.com) and sign up
2. Verify your email
3. You'll land on the dashboard

---

## Step 2 — Get an API Key

1. In the dashboard, go to **Settings → API Keys**
2. Click **Create New Key**
3. Choose environment: `sandbox` (testing) or `production`
4. Copy the key — **it will only be shown once**

```bash
export LUNOSS_API_KEY="sk_live_abc123..."
export LUNOSS_WEBHOOK_SECRET="whsec_xyz..."
```

> ⚠️ Never commit API keys to git. Use `.env` files and add them to `.gitignore`.

---

## Step 3 — Create a Payment

```bash
curl -X POST "https://api.lunosspay.com/api/payments" \
  -H "Authorization: Bearer $LUNOSS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_wallet": "YOUR_SOLANA_WALLET_ADDRESS",
    "amount": 0.01,
    "label": "Test Order",
    "message": "Payment for Order #001",
    "reference": "ORDER-001"
  }'
```

**Response:**

```json
{
  "id": "pay_abc123",
  "status": "pending",
  "amount": 0.01,
  "qr_code": "data:image/png;base64,...",
  "payment_url": "https://app.lunosspay.com/pay/pay_abc123",
  "expires_at": "2026-03-08T15:30:00Z"
}
```

---

## Step 4 — Display to the Customer

Show the `qr_code` image or redirect to `payment_url`. The customer opens their Solana wallet (Phantom, Backpack, etc.) and scans or taps.

---

## Step 5 — Check Payment Status

**Option A — Polling (simple):**

```bash
curl "https://api.lunosspay.com/api/payments/pay_abc123" \
  -H "Authorization: Bearer $LUNOSS_API_KEY"
```

Poll every 3–5 seconds until `status` is `completed`.

**Option B — Webhooks (recommended for production):**

Register your endpoint and listen for `payment.completed`.

See `examples/webhook-node.js` for a complete handler.

---

## Step 6 — Fulfill the Order

Once payment is `completed`, deliver your product or service.

```js
if (event === 'payment.completed') {
  const { payment_id, metadata } = data;
  await fulfillOrder(metadata.order_id);
}
```

---

## Next Steps

- Read the full [API Reference](./API-REFERENCE.md)
- Understand the [Payment Flow](./PAYMENT-FLOW.md)
- Explore `examples/` for complete integration patterns
- Install the TypeScript SDK from `for-devs/sdk/`
