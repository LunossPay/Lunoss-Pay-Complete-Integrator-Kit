# Lunoss Pay — API Reference

**Base URL (Production):** `https://api.lunosspay.com`  
**Base URL (Local):** `http://localhost:3002`  
**Auth:** `Authorization: Bearer {token_or_api_key}`

---

## Authentication

### POST /auth/signup

Create a new account.

```json
{
  "email": "dev@example.com",
  "password": "Strong@Pass123",
  "fullName": "Developer Name",
  "companyName": "My Company",
  "country": "BR",
  "merchantWallet": "YourSolanaWalletAddress"
}
```

Response `201`:
```json
{ "message": "Account created successfully", "userId": "uuid", "merchantId": "uuid" }
```

---

### POST /auth/login

```json
{ "email": "dev@example.com", "password": "Strong@Pass123" }
```

Response `200`:
```json
{ "token": "eyJ...", "user": { "id": "uuid", "email": "...", "fullName": "..." }, "merchantId": "uuid" }
```

---

### GET /auth/me
Returns the currently authenticated user.

### POST /auth/refresh
Renews the JWT token.

### POST /auth/logout
Invalidates the current session.

---

## Payments

### POST /api/payments

Create a new payment request.

```json
{
  "merchant_wallet": "SolanaWalletAddress",
  "amount": 0.1,
  "label": "Product Purchase",
  "message": "Payment for Order X",
  "reference": "ORDER-123",
  "metadata": { "order_id": "123", "customer_email": "buyer@example.com" }
}
```

Response `201`:
```json
{
  "id": "pay_uuid",
  "status": "pending",
  "amount": 0.1,
  "qr_code": "solana:Wallet?amount=0.1...",
  "payment_url": "https://app.lunosspay.com/pay/pay_uuid",
  "expires_at": "2026-03-08T15:30:00Z"
}
```

---

### GET /api/payments/:id

Get payment details and current status.

**Status values:** `pending`, `completed`, `failed`, `cancelled`, `expired`

---

### GET /api/payments

List payments with optional filters.

| Query Param | Type | Description |
|---|---|---|
| `status` | string | Filter by status |
| `limit` | number | Results per page (default 50) |
| `offset` | number | Pagination offset |

---

### POST /api/payments/:id/cancel

Cancel a pending payment.

---

### GET /api/payments/:id/qrcode

Returns a PNG image of the payment QR code.

---

### GET /api/payments/stats

```json
{
  "total_payments": 150,
  "total_volume": 45.5,
  "completed": 120,
  "pending": 20,
  "failed": 10,
  "average_amount": 0.303
}
```

---

## Products

### POST /api/products

```json
{
  "name": "Premium Subscription",
  "description": "Monthly premium access",
  "price": 9.99,
  "currency": "USD",
  "stock": 1000,
  "is_active": true
}
```

### GET /api/products — List products (`?is_active=true&limit=50`)
### GET /api/products/:id — Get product
### PUT /api/products/:id — Update product
### PATCH /api/products/:id/stock — Update stock: `{ "quantity": 500 }`
### DELETE /api/products/:id — Delete product
### GET /api/products/search?q=term — Search products

---

## Coupons

### POST /api/coupons

```json
{
  "code": "WELCOME10",
  "discount_type": "percentage",
  "discount_value": 10,
  "max_uses": 100,
  "expires_at": "2026-12-31T23:59:59Z",
  "min_purchase_amount": 5.0
}
```

**discount_type:** `percentage` | `fixed`

### POST /api/coupons/validate

```json
{ "code": "WELCOME10", "purchase_amount": 50.0 }
```

Response:
```json
{ "valid": true, "discount_amount": 5.0, "final_amount": 45.0 }
```

### GET /api/coupons — List coupons
### GET /api/coupons/:id — Get coupon
### PUT /api/coupons/:id — Update coupon
### POST /api/coupons/:id/deactivate — Deactivate coupon
### DELETE /api/coupons/:id — Delete coupon

---

## Organizations

### POST /api/organizations
```json
{ "name": "My Company", "description": "E-commerce platform", "country": "BR", "website": "https://mycompany.com" }
```

### GET /api/organizations — List orgs
### GET /api/organizations/:id — Get org
### PUT /api/organizations/:id — Update org
### GET /api/organizations/:id/members — List members
### POST /api/organizations/:id/members — Add member: `{ "user_id": "uuid", "role": "admin" }`

**Roles:** `owner` | `admin` | `finance` | `viewer`

### GET /api/organizations/:id/wallets — List wallets
### POST /api/organizations/:id/wallets — Add wallet
### GET /api/organizations/:id/stats — Org statistics

---

## Invites

### POST /api/organizations/:orgId/invites
```json
{ "email": "newmember@example.com", "role": "viewer" }
```

### GET /api/organizations/:orgId/invites — List invites
### GET /api/organizations/:orgId/invites/pending — Pending invites
### POST /api/invites/:inviteCode/accept — Accept invite
### POST /api/invites/:inviteCode/reject — Reject invite
### DELETE /api/organizations/:orgId/invites/:inviteId — Cancel invite

---

## User Wallets

### GET /api/user-wallets — List wallets
### GET /api/user-wallets/:id — Get wallet
### POST /api/user-wallets — Create wallet
### PUT /api/user-wallets/:id — Update wallet
### PUT /api/user-wallets/:id/set-primary — Set as primary
### POST /api/user-wallets/:id/sync-balance — Sync balance
### DELETE /api/user-wallets/:id — Delete wallet
### GET /api/user-wallets/:id/transactions — Wallet transactions
### GET /api/user-wallets/stats/summary — Wallet stats

---

## Transactions

### GET /api/transactions — List transactions

Query params: `status`, `from_date`, `to_date`, `limit`, `offset`

### GET /api/transactions/:id — Get transaction
### GET /api/transactions/stats — Transaction statistics
### GET /api/transactions/export?format=csv — Export (csv | json | xlsx)

---

## Webhooks

### POST /api/webhooks

```json
{
  "url": "https://yourapp.com/webhook",
  "events": ["payment.completed", "payment.failed"],
  "secret": "your-webhook-secret"
}
```

**Available events:**
- `payment.created`, `payment.completed`, `payment.failed`, `payment.cancelled`
- `product.created`, `product.updated`
- `transaction.completed`

### GET /api/webhooks — List webhooks
### GET /api/webhooks/:id — Get webhook
### PUT /api/webhooks/:id — Update webhook
### DELETE /api/webhooks/:id — Delete webhook
### POST /api/webhooks/:id/test — Send test event

**Webhook payload format:**
```json
{
  "event": "payment.completed",
  "timestamp": "2026-03-08T14:25:00Z",
  "data": { "payment_id": "uuid", "amount": 0.1, "status": "completed" },
  "signature": "sha256-hmac-signature"
}
```

---

## API Keys

### POST /api/keys
```json
{ "name": "Production Key", "environment": "production" }
```
> ⚠️ Save the key immediately — it's shown only once.

### GET /api/keys — List keys
### DELETE /api/keys/:id — Revoke key

---

## Reports

### GET /api/reports/dashboard
### GET /api/reports/revenue?from=2026-01-01&to=2026-03-08&group_by=day
### GET /api/reports/volume?period=last_7_days
### GET /api/reports/top-products?limit=10
### GET /api/reports/coupons?from=2026-01-01

---

## Audit & Compliance

### GET /api/audit/logs?from=2026-01-01&limit=100
### GET /api/alerts?status=new&limit=50
### GET /api/approvals/pending
### POST /api/approvals/:id/approve — `{ "comment": "Approved" }`
### POST /api/approvals/:id/reject — `{ "reason": "Insufficient docs" }`

---

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |

---

## Rate Limits

- **General:** 100 requests/minute
- **Auth:** 5 login attempts per 15 minutes
- **Signup:** 3 per hour per IP
