/**
 * Lunoss Pay — Example: Webhook Handler (Express)
 * Usage: node webhook-node.js
 * 
 * Required env vars:
 *   WEBHOOK_SECRET=your_webhook_secret
 *   PORT=3001
 */

require('dotenv').config();
const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// IMPORTANT: Use raw body parser for signature verification
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

// ─── Signature verification ───────────────────────────────────────────────

function verifySignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    );
  } catch {
    return false;
  }
}

// ─── Webhook endpoint ────────────────────────────────────────────────────

app.post('/webhook/lunoss', async (req, res) => {
  const signature = req.headers['x-lunoss-signature'];

  // 1. Verify signature
  const isValid = verifySignature(
    req.rawBody,
    signature,
    process.env.WEBHOOK_SECRET
  );

  if (!isValid) {
    console.warn('⚠️  Invalid webhook signature — rejected');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { event, data, timestamp } = req.body;
  console.log(`\n📨 Webhook received: ${event} at ${timestamp}`);

  // 2. Respond immediately (before processing)
  res.sendStatus(200);

  // 3. Process event asynchronously
  try {
    switch (event) {
      case 'payment.completed':
        await handlePaymentCompleted(data);
        break;

      case 'payment.failed':
        await handlePaymentFailed(data);
        break;

      case 'payment.cancelled':
        await handlePaymentCancelled(data);
        break;

      case 'payment.created':
        console.log('   New payment created:', data.id);
        break;

      default:
        console.log(`   ℹ️  Unhandled event type: ${event}`);
    }
  } catch (err) {
    console.error('   ❌ Error processing webhook:', err.message);
  }
});

// ─── Event handlers ──────────────────────────────────────────────────────

async function handlePaymentCompleted(data) {
  console.log('   ✅ Payment confirmed!');
  console.log(`      Payment ID:   ${data.payment_id}`);
  console.log(`      Amount:       ${data.amount} SOL`);
  console.log(`      TX Signature: ${data.transaction_signature}`);

  // Extract metadata passed when creating the payment
  const { customer_email, order_id, product_id } = data.metadata || {};

  if (order_id) {
    console.log(`      Order:        ${order_id}`);
    // TODO: mark order as paid in your database
    // await db.orders.update({ id: order_id }, { status: 'paid', payment_id: data.payment_id });
  }

  if (customer_email) {
    console.log(`      Customer:     ${customer_email}`);
    // TODO: send confirmation email
    // await sendConfirmationEmail(customer_email, data);
  }

  if (product_id) {
    // TODO: grant access or fulfill product
    // await grantAccess(customer_email, product_id);
  }
}

async function handlePaymentFailed(data) {
  console.log('   ❌ Payment failed:', data.payment_id);
  // TODO: notify customer, release reserved stock, etc.
}

async function handlePaymentCancelled(data) {
  console.log('   🚫 Payment cancelled:', data.payment_id);
  // TODO: update order status
}

// ─── Start server ────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🎧 Webhook handler running on port ${PORT}`);
  console.log(`   Endpoint: POST http://localhost:${PORT}/webhook/lunoss`);
  console.log('\n   Register this URL in the Lunoss Pay dashboard:');
  console.log('   Settings → Webhooks → Add Endpoint\n');
});
