#!/usr/bin/env node
/**
 * Lunoss Pay — Test Payment Script
 * Creates a real payment and prints the QR URL.
 * Usage: node scripts/test-payment.js
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.LUNOSS_BASE_URL || 'https://api.lunosspay.com';
const API_KEY = process.env.LUNOSS_API_KEY;
const WALLET = process.env.MERCHANT_WALLET;

if (!API_KEY) {
  console.error('❌ LUNOSS_API_KEY is not set. Add it to your .env file.');
  process.exit(1);
}

if (!WALLET) {
  console.error('❌ MERCHANT_WALLET is not set. Add it to your .env file.');
  process.exit(1);
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
});

async function main() {
  console.log('\n🔷 Creating test payment...\n');

  const { data: payment } = await api.post('/api/payments', {
    merchant_wallet: WALLET,
    amount: 0.001,
    label: 'SDK Test Payment',
    message: 'Automated test from integrator kit',
    reference: `TEST-${Date.now()}`,
    metadata: { test: true, created_by: 'lunoss-integrator-kit' },
  });

  console.log('✅ Payment created!');
  console.log('');
  console.log('  ID:          ', payment.id);
  console.log('  Status:      ', payment.status);
  console.log('  Amount:      ', payment.amount, 'SOL');
  console.log('  Payment URL: ', payment.payment_url);
  console.log('  Expires at:  ', payment.expires_at);
  console.log('');
  console.log('  Open the payment URL to test the full flow:');
  console.log(' ', payment.payment_url);
  console.log('');
  console.log('  Or check its status:');
  console.log(`  GET ${BASE_URL}/api/payments/${payment.id}`);
  console.log('');
}

main().catch(err => {
  console.error('Error:', err.response?.data || err.message);
  process.exit(1);
});
