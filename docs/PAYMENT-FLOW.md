# Lunoss Pay — Payment Flow

A complete walkthrough of every state a payment goes through, from creation to confirmation.

---

## Flow Overview

```
Your Server          Lunoss Pay API         Solana Blockchain       Customer Wallet
     │                     │                        │                      │
     │── POST /payments ──►│                        │                      │
     │◄── { id, qrCode } ──│                        │                      │
     │                     │                        │                      │
     │    (display QR / payment_url to customer)     │                      │
     │                     │                        │◄── Customer scans ───│
     │                     │                        │◄── TX broadcast ─────│
     │                     │◄── TX confirmed ───────│                      │
     │◄── webhook POST ────│                        │                      │
     │    payment.completed│                        │                      │
     │                     │                        │                      │
     │── fulfill order ───►│                        │                      │
```

---

## Payment States

| State | Description |
|---|---|
| `pending` | Payment created, waiting for customer to pay |
| `completed` | Transaction confirmed on-chain |
| `failed` | Transaction failed or rejected |
| `cancelled` | Cancelled by the merchant |
| `expired` | Payment window expired (default: 15 minutes) |

---

## Step-by-Step

### 1. Create Payment

```js
const payment = await api.post('/api/payments', {
  merchant_wallet: process.env.MERCHANT_WALLET,
  amount: 9.99,
  label: 'Pro Subscription',
  reference: 'ORDER-42',
  metadata: { user_id: 'usr_123', plan: 'pro' }
});

// payment.id         → store this in your database
// payment.qr_code    → display as <img src="..."> 
// payment.payment_url → redirect mobile users
// payment.expires_at → show countdown timer
```

### 2. Display to Customer

**QR Code (desktop):**
```html
<img src="data:image/png;base64,{{ payment.qr_code }}" alt="Scan to pay" />
<p>Expires at: {{ payment.expires_at }}</p>
```

**Payment URL (mobile):**
```html
<a href="{{ payment.payment_url }}">Pay with Phantom</a>
```

### 3. Wait for Confirmation

**Option A — Webhook (recommended):**

Register your endpoint at `POST /api/webhooks` with event `payment.completed`.

```js
// Your webhook handler
app.post('/webhook/lunoss', (req, res) => {
  const isValid = verifySignature(req.rawBody, req.headers['x-lunoss-signature'], WEBHOOK_SECRET);
  if (!isValid) return res.sendStatus(401);

  const { event, data } = req.body;
  if (event === 'payment.completed') {
    fulfillOrder(data.metadata.order_id);
  }
  res.sendStatus(200);
});
```

**Option B — Polling:**

```js
async function waitForPayment(paymentId, timeoutMs = 300000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const { data } = await api.get(`/api/payments/${paymentId}`);
    if (data.status === 'completed') return data;
    if (['failed', 'cancelled', 'expired'].includes(data.status)) throw new Error(data.status);
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error('Timeout');
}
```

### 4. Fulfill the Order

Once `completed`, deliver your product or service.

```js
async function fulfillOrder(paymentData) {
  const { metadata, id: paymentId } = paymentData;
  
  // Example actions:
  await db.orders.update({ payment_id: paymentId }, { status: 'paid' });
  await sendConfirmationEmail(metadata.customer_email);
  await grantAccess(metadata.user_id, metadata.plan);
}
```

---

## Error Handling

```js
try {
  const payment = await waitForPayment(paymentId);
  await fulfillOrder(payment);
} catch (error) {
  if (error.message === 'expired') {
    // Offer the customer to create a new payment
  } else if (error.message === 'failed') {
    // Log and notify support
  }
}
```

---

## Security Checklist

- [ ] Always verify webhook signature before processing
- [ ] Store `payment.id` in your DB before showing QR to customer
- [ ] Use idempotency: check if order is already fulfilled before processing webhook
- [ ] Set a timeout and handle expired payments gracefully
- [ ] Never trust client-side confirmation — always verify server-side
