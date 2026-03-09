/**
 * Lunoss Pay — Example: Create and monitor a payment
 * Usage: node create-payment.js
 */

require('dotenv').config();
const axios = require('axios');

const api = axios.create({
  baseURL: process.env.LUNOSS_BASE_URL || 'https://api.lunosspay.com',
  headers: {
    Authorization: `Bearer ${process.env.LUNOSS_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

async function createAndMonitorPayment() {
  console.log('🔷 Creating payment...\n');

  // 1. Create payment
  const { data: payment } = await api.post('/api/payments', {
    merchant_wallet: process.env.MERCHANT_WALLET,
    amount: 0.01,
    label: 'Test Payment',
    message: 'Payment for Order #001',
    reference: `ORDER-${Date.now()}`,
    metadata: {
      customer_email: 'customer@example.com',
      product_id: 'prod_123',
    },
  });

  console.log('✅ Payment created!');
  console.log(`   ID:          ${payment.id}`);
  console.log(`   Status:      ${payment.status}`);
  console.log(`   Amount:      ${payment.amount} SOL`);
  console.log(`   Payment URL: ${payment.payment_url}`);
  console.log(`   Expires at:  ${payment.expires_at}`);
  console.log('');

  // 2. Poll for confirmation
  console.log('⏳ Waiting for payment confirmation...');
  console.log('   (In real usage, use webhooks instead of polling)');
  console.log('');

  const maxWait = 120000; // 2 minutes
  const pollInterval = 3000;
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    await sleep(pollInterval);

    const { data: updated } = await api.get(`/api/payments/${payment.id}`);
    process.stdout.write(`   Status: ${updated.status}\r`);

    if (updated.status === 'completed') {
      console.log('\n✅ Payment confirmed!');
      console.log(`   TX Signature: ${updated.transaction_signature}`);
      return updated;
    }

    if (['failed', 'cancelled', 'expired'].includes(updated.status)) {
      console.log(`\n❌ Payment ${updated.status}.`);
      return null;
    }
  }

  console.log('\n⏰ Timeout — payment not confirmed within 2 minutes.');
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

createAndMonitorPayment().catch(err => {
  console.error('Error:', err.response?.data || err.message);
  process.exit(1);
});
