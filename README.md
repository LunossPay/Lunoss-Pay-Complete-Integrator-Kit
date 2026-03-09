# Lunoss Pay

> **Solana payments. Built for builders. Shipping now.**

---

We're building the infrastructure layer that crypto commerce has been missing.

Not another dashboard. Not another wrapper around someone else's API.  
**Lunoss Pay is a full-stack payment gateway on Solana** — designed from the ground up for developers who want to accept real money, on-chain, without the friction.

---

## What we're building

Crypto payments today are broken. Wallets are fragmented. Confirmation flows are guesswork. Most "payment solutions" are glorified QR code generators that leave you to figure out the hard parts yourself.

We're fixing that.

Lunoss Pay gives you a single API that handles the entire payment lifecycle — from creating a Solana Pay request to confirming the transaction on-chain, triggering your webhook, and handing back structured data you can actually use.

**The result:** you integrate once, and payments just work.

---

## Where we are

This is an active project. The core is built and running.

**What's live today:**

- ✅ Payment creation with QR Code and Solana Pay URL
- ✅ Real-time on-chain confirmation via Solana RPC
- ✅ Webhook delivery with HMAC signature verification
- ✅ Products, coupons, and coupon validation
- ✅ Organizations with multi-wallet support and role-based access
- ✅ Transaction history, audit logs, and compliance reports
- ✅ Authorization rules and multi-step approval flows
- ✅ Full REST API with Bearer token and API Key auth
- ✅ TypeScript SDK (included in this kit)

**What's in progress:**

- 🔄 Subscription billing and recurring payments
- 🔄 Solana program for on-chain splits and treasury management
- 🔄 Merchant-facing dashboard UI
- 🔄 Hosted payment page (zero-code checkout)
- 🔄 Multi-currency support (USDC, USDT)

---

## The opportunity

The Solana ecosystem processes billions in volume. Yet there's no Stripe equivalent.  
No clean developer experience. No standard confirmation flow. No production-grade tooling for merchants.

That's the gap Lunoss Pay is closing.

We're not building for crypto natives who already know how to handle wallets.  
We're building for **product teams and developers** who want to add Solana payments to a real product — without becoming blockchain engineers first.

---

## For developers

This kit is your starting point. It contains:

| What | Why |
|---|---|
| `docs/QUICKSTART.md` | First payment in under 5 minutes |
| `docs/API-REFERENCE.md` | Full endpoint reference |
| `docs/PAYMENT-FLOW.md` | How the full lifecycle works |
| `examples/` | Copy-paste Node.js and cURL code |
| `scripts/` | Test your credentials and create a live payment |
| `for-devs/sdk/` | TypeScript SDK — typed, async, retry-ready |

```bash
# Start here
cp .env.example .env     # add your API key
npm install
npm run health           # confirm everything works
npm run test-payment     # create your first real payment
```

---

## The API in one request

```bash
curl -X POST "https://api.lunosspay.com/api/payments" \
  -H "Authorization: Bearer $LUNOSS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_wallet": "YOUR_SOLANA_WALLET",
    "amount": 9.99,
    "label": "Pro Plan",
    "reference": "ORDER-001",
    "metadata": { "user_id": "usr_123" }
  }'
```

You get back a QR code, a Solana Pay URL, and a payment ID.  
Your customer pays. We detect it on-chain. We POST to your webhook.  
You fulfill the order.

That's the entire integration surface.

---

## Philosophy

We believe the best payment infrastructure is invisible.  
You shouldn't think about RPC nodes, transaction confirmation, or signature verification.  
You should think about your product.

We handle the blockchain. You handle the business logic.

---

## Get involved

This project is moving fast. If you're a developer who wants early access, wants to contribute, or just wants to follow along — reach out.

| | |
|---|---|
| Dashboard | [app.lunosspay.com](https://app.lunosspay.com) |
| Docs | [docs.lunosspay.com](https://docs.lunosspay.com) |
| Email | dev@lunosspay.com |
| Discord | [discord.gg/lunosspay](https://discord.gg/lunosspay) |

---

<br>

**Lunoss Pay** — Solana payment infrastructure for the next wave of crypto commerce.  
*Currently in active development. Production-ready core. Shipping continuously.*
