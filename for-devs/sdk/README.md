# @lunosspay/sdk

Official TypeScript SDK for Lunoss Pay.

## Installation

```bash
npm install @lunosspay/sdk
# or
yarn add @lunosspay/sdk
```

## Quick Start

```typescript
import LunossPaySDK from '@lunosspay/sdk';

const lunoss = new LunossPaySDK({
  baseURL: 'https://api.lunosspay.com',
  apiKey: process.env.LUNOSS_API_KEY,
});

// Create a payment
const payment = await lunoss.createPayment({
  merchant_wallet: 'YOUR_SOLANA_WALLET',
  amount: 9.99,
  label: 'Pro Subscription',
  reference: 'ORDER-001',
});

console.log('QR Code:', payment.qr_code);
console.log('Payment URL:', payment.payment_url);

// Wait for confirmation
const result = await lunoss.waitForPayment(payment.id, {
  maxWaitTime: 300000, // 5 minutes
  pollInterval: 3000,
});

if (result.success) {
  console.log('Payment confirmed!');
}
```

## Verify Webhook Signature

```typescript
import LunossPaySDK from '@lunosspay/sdk';

const isValid = LunossPaySDK.verifyWebhookSignature(
  req.body,
  req.headers['x-lunoss-signature'],
  process.env.WEBHOOK_SECRET
);
```

## Available Methods

| Category | Methods |
|---|---|
| Auth | `signup`, `login`, `logout`, `getMe`, `refreshToken` |
| Payments | `createPayment`, `getPayment`, `listPayments`, `cancelPayment`, `waitForPayment` |
| Products | `createProduct`, `listProducts`, `getProduct`, `updateProduct`, `deleteProduct` |
| Coupons | `createCoupon`, `listCoupons`, `validateCoupon`, `updateCoupon`, `deleteCoupon` |
| Organizations | `createOrganization`, `listOrganizations`, `getOrganization`, `updateOrganization` |
| Invites | `createInvite`, `listInvites`, `acceptInvite`, `cancelInvite` |
| Transactions | `listTransactions`, `getTransaction`, `getTransactionSummary` |
| Reports | `getDashboard`, `getRevenue` |
| Webhooks | `createWebhook`, `listWebhooks`, `deleteWebhook`, `testWebhook` |
| Approvals | `getPendingApprovals`, `approveTransaction`, `rejectTransaction` |
| Audit | `getAuditLogs` |
| Static | `LunossPaySDK.verifyWebhookSignature` |
