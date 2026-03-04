# Lunoss Pay — Complete Integrator Kit

**Accept SOL payments on Solana in minutes.**  
This repository contains everything you need to understand, test, and integrate the Lunoss Pay API into your product.

---

## What is Lunoss Pay?

A payment gateway on the Solana blockchain: your application calls the API, the customer pays with their wallet (Phantom, etc.), and you receive real-time confirmation — with QR Code, Solana Pay, and webhooks.

- **Single payments** with QR and Solana Pay link
- **Organizations** with multiple wallets, members, and splits
- **Webhooks** for `payment.confirmed`, `payment.expired`, and more
- **Audit and treasury** tools for secure operations

---

## What's in this kit

| Folder / File | Purpose |
|---|---|
| `docs/QUICKSTART.md` | Get started in 5 minutes: API Key, first payment, webhook |
| `docs/API-REFERENCE.md` | Full endpoint reference (payments, orgs, auth, webhooks) |
| `docs/PAYMENT-FLOW.md` | Full flow: create → QR → pay → confirm → webhook |
| `examples/` | Ready-to-use code: cURL, Node.js, minimal client to copy |
| `scripts/` | Scripts to test the API (health check, create payment) |

> This is not a website — it's a complete package for developers integrating the API.

---

## Quick Start

### 1. Get an API Key

1. Create an account on the [Lunoss Pay dashboard](https://app.lunosspay.com) (or the staging environment)
2. Go to **Settings → API Keys** and create a new key (Sandbox or Production)
3. Copy the key once and store it as an environment variable

```bash
export LUNOSS_API_KEY="your_key_here"
```

### 2. Create your first payment

```bash
curl -X POST "https://api.lunosspay.com/api/payments" \
  -H "X-API-Key: $LUNOSS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 0.01,
    "currency": "SOL",
    "label": "Test Payment",
    "message": "My first payment"
  }'
```

**Response fields:**

| Field | Description |
|---|---|
| `id` | Unique payment identifier |
| `qrCode` | Base64 QR code image to display to the customer |
| `solanaPayUrl` | Deep link for wallet apps |
| `expiresAt` | ISO timestamp of payment expiry |

### 3. Receive confirmation

**Option A — Polling:** Query `GET /api/payments/:id` until status is `confirmed`.

**Option B — Webhooks (recommended):** Configure an endpoint in the dashboard. The API will POST `payment.confirmed` and other events to your URL. Always validate the signature before processing.

```js
// Minimal webhook handler (Node.js / Express)
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-lunoss-signature'];

  if (!verifySignature(req.rawBody, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  const { event, data } = req.body;

  if (event === 'payment.confirmed') {
    console.log('Payment confirmed:', data.id);
    // fulfill your order here
  }

  res.sendStatus(200);
});
```

Full examples in `examples/webhook-node.js` and `examples/webhook-curl.sh`.

---

## Environments

| Environment | Base URL |
|---|---|
| Production | `https://api.lunosspay.com` |
| Staging / Sandbox | Available in the dashboard under **Settings → Environments** |
| Local development | `http://localhost:3002` (or the port defined in your `.env`) |

---

## Brand Color Palette

Lunoss Pay's visual identity is anchored in **Lime Green** — representing speed, transparency, and the energy of on-chain transactions.

| Token | Hex | Usage |
|---|---|---|
| `--lime` | `#BFFF00` | Primary brand color, CTAs, key highlights |
| `--lime-dim` | `#A3E000` | Hover states, secondary accents |
| `--lime-glow` | `#CEFF33` | Glows, active indicators |
| `--black` | `#080C07` | Page and app background |
| `--surface` | `#0E1410` | Card and container backgrounds |
| `--surface-2` | `#152018` | Elevated surfaces, modals |
| `--surface-3` | `#1C2E20` | Inputs, code blocks |
| `--border` | `#2A3D2C` | Dividers and outlines |
| `--muted` | `#5A7A5C` | Placeholder text, captions |
| `--text` | `#D4E8D5` | Body text |
| `--text-dim` | `#8FAF90` | Secondary text, descriptions |

**Accent colors** (use sparingly for status and feedback):

| Token | Hex | Usage |
|---|---|---|
| `--sol-purple` | `#9945FF` | Solana ecosystem references |
| `--sol-green` | `#14F195` | Solana ecosystem references |
| `--amber` | `#FFB800` | Warnings, pending states |
| `--red` | `#FF4444` | Errors, expired payments |

---

## Repository structure

```
Lunoss-Pay/
├── apps/api/        # Backend — payments, orgs, auth, webhooks, admin routes
├── for-devs/sdk/    # Official TypeScript SDK
├── examples/        # Integration examples (e-commerce, subscriptions, etc.)
├── docs/            # API_REFERENCE.md, BACKEND_STATUS.md, guides
└── program/         # Solana program (Anchor) — treasury, fees, splits
```

This kit (`build-pb`) is a focused subset for integrators: essential docs, examples, and scripts — without cloning the entire monorepo.

---

## Next steps

1. Read `docs/QUICKSTART.md` for a full walkthrough
2. Run the examples in `examples/` (cURL and/or Node.js)
3. Integrate the official TypeScript SDK from `for-devs/sdk`
4. Configure webhooks and validate signatures (`examples/webhook-*`)
5. Explore `docs/API-REFERENCE.md` for organizations, dashboard, and treasury endpoints

---

## Support

| Channel | Link |
|---|---|
| Dashboard | [app.lunosspay.com](https://app.lunosspay.com) |
| Documentation | [docs.lunosspay.com](https://docs.lunosspay.com) |
| Status page | [status.lunosspay.com](https://status.lunosspay.com) |

---

**Lunoss Pay** — Solana payment gateway. Integrate with confidence.
