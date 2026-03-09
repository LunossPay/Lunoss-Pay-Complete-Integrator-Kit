<div align="center">

<br/>

![Lunoss Pay](https://capsule-render.vercel.app/api?type=waving&color=BFFF00&height=140&section=header&text=Lunoss%20Pay&fontSize=52&fontColor=080C07&fontAlignY=65&animation=fadeIn)

<br/>

[![Status](https://img.shields.io/badge/status-active%20development-BFFF00?style=for-the-badge&labelColor=0E1410&color=BFFF00)](https://app.lunosspay.com)
[![Solana](https://img.shields.io/badge/Solana-powered-9945FF?style=for-the-badge&labelColor=0E1410&logo=solana&logoColor=9945FF)](https://solana.com)
[![API](https://img.shields.io/badge/REST-API%20ready-14F195?style=for-the-badge&labelColor=0E1410)](https://docs.lunosspay.com)
[![SDK](https://img.shields.io/badge/TypeScript-SDK-3178C6?style=for-the-badge&labelColor=0E1410&logo=typescript&logoColor=3178C6)](./for-devs/sdk)

<br/>

### Solana payment infrastructure for the next wave of crypto commerce.

**One API. Real-time confirmation. Webhooks. No blockchain expertise required.**

<br/>

[Get API Key](https://app.lunosspay.com) · [Read the Docs](https://docs.lunosspay.com) · [Discord](https://discord.gg/lunosspay)

<br/>

</div>

---

## What we're building

Crypto payments today are broken. Wallets are fragmented. Confirmation flows are guesswork. Most "payment solutions" are glorified QR code generators that leave you to figure out the hard parts yourself.

**We're fixing that.**

Lunoss Pay gives you a single API that handles the entire payment lifecycle — from creating a Solana Pay request to confirming the transaction on-chain, triggering your webhook, and handing back structured data you can actually use.

> You integrate once, and payments just work.

---

## Where we are

This is an active project. The core is built and running.

<table>
<tr>
<td width="50%" valign="top">

**✅ Live today**

- Payment creation + QR Code + Solana Pay URL
- Real-time on-chain confirmation via Solana RPC
- Webhook delivery with HMAC signature verification
- Products, coupons, and coupon validation
- Organizations with multi-wallet + role-based access
- Transaction history, audit logs, compliance reports
- Authorization rules and multi-step approval flows
- Full REST API — Bearer token and API Key auth
- TypeScript SDK

</td>
<td width="50%" valign="top">

**🔄 In progress**

- Subscription billing and recurring payments
- Solana program for on-chain splits and treasury
- Merchant-facing dashboard UI
- Hosted payment page (zero-code checkout)
- Multi-currency support — USDC, USDT

</td>
</tr>
</table>

---

## The opportunity

The Solana ecosystem processes billions in volume. Yet there's no Stripe equivalent. No clean developer experience. No standard confirmation flow. No production-grade tooling for merchants.

**That's the gap Lunoss Pay is closing.**

We're not building for crypto natives who already know how to handle wallets. We're building for product teams and developers who want to add Solana payments to a real product — without becoming blockchain engineers first.

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

**That's the entire integration surface.**

---

## What's in this kit

| Path | Purpose |
|---|---|
| `docs/QUICKSTART.md` | First payment in under 5 minutes |
| `docs/API-REFERENCE.md` | Full endpoint reference |
| `docs/PAYMENT-FLOW.md` | Full lifecycle: create → confirm → webhook |
| `examples/` | Copy-paste Node.js and cURL code |
| `scripts/` | Test credentials and create a live payment |
| `for-devs/sdk/` | TypeScript SDK — typed, async, retry-ready |

```bash
# Start here
cp .env.example .env      # add your API key
npm install
npm run health            # confirm everything works
npm run test-payment      # create your first real payment
```

---

## Philosophy

> The best payment infrastructure is invisible.
>
> You shouldn't think about RPC nodes, transaction confirmation, or signature verification. You should think about your product.
>
> **We handle the blockchain. You handle the business logic.**

---

## Get involved

This project is moving fast. If you're a developer who wants early access, wants to contribute, or just wants to follow along — reach out.

<div align="center">

<br/>

[![Dashboard](https://img.shields.io/badge/Dashboard-app.lunosspay.com-BFFF00?style=for-the-badge&labelColor=0E1410)](https://app.lunosspay.com)
[![Docs](https://img.shields.io/badge/Docs-docs.lunosspay.com-D4E8D5?style=for-the-badge&labelColor=0E1410)](https://docs.lunosspay.com)
[![Discord](https://img.shields.io/badge/Discord-Join%20us-5865F2?style=for-the-badge&labelColor=0E1410&logo=discord&logoColor=white)](https://discord.gg/lunosspay)
[![Email](https://img.shields.io/badge/Email-dev%40lunosspay.com-8FAF90?style=for-the-badge&labelColor=0E1410)](mailto:dev@lunosspay.com)

<br/>

![Footer](https://capsule-render.vercel.app/api?type=waving&color=BFFF00&height=100&section=footer&animation=fadeIn)

</div>
