#!/usr/bin/env node
/**
 * Lunoss Pay — Health Check Script
 * Checks if the API is up and your credentials work.
 * Usage: node scripts/health-check.js
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.LUNOSS_BASE_URL || 'https://api.lunosspay.com';
const API_KEY = process.env.LUNOSS_API_KEY;

async function check(label, fn) {
  process.stdout.write(`  ${label.padEnd(35)}`);
  try {
    const result = await fn();
    console.log('✅', result || 'OK');
    return true;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.log('❌', msg);
    return false;
  }
}

async function main() {
  console.log('\n🔷 Lunoss Pay — Health Check');
  console.log(`   Base URL: ${BASE_URL}\n`);

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  let allOk = true;

  allOk &= await check('API reachable', async () => {
    const { data } = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    return data.status;
  });

  allOk &= await check('API Key valid', async () => {
    const { data } = await api.get('/auth/me');
    return data.email || 'Authenticated';
  });

  allOk &= await check('Payments endpoint', async () => {
    await api.get('/api/payments?limit=1');
    return 'Accessible';
  });

  allOk &= await check('Products endpoint', async () => {
    await api.get('/api/products?limit=1');
    return 'Accessible';
  });

  allOk &= await check('Reports endpoint', async () => {
    await api.get('/api/reports/dashboard');
    return 'Accessible';
  });

  console.log('');
  if (allOk) {
    console.log('✅ All checks passed. You are ready to integrate!\n');
  } else {
    console.log('⚠️  Some checks failed. Verify your credentials and try again.\n');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n❌ Unexpected error:', err.message);
  process.exit(1);
});
