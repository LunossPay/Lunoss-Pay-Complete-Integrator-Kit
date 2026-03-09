/**
 * Lunoss Pay — Example: E-commerce Checkout
 *
 * Demonstrates:
 *   - Loading products from the API
 *   - Validating and applying a coupon
 *   - Creating a payment with full metadata
 *   - Waiting for confirmation and fulfilling the order
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

// ─── Checkout class ──────────────────────────────────────────────────────

class Checkout {
  async run(items, customer, couponCode = null) {
    console.log('\n🛒 Starting checkout...\n');

    // 1. Load products and calculate subtotal
    let subtotal = 0;
    const lineItems = [];

    for (const item of items) {
      const { data: product } = await api.get(`/api/products/${item.productId}`);
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;
      lineItems.push({ product, quantity: item.quantity, lineTotal });
      console.log(`   ${item.quantity}x ${product.name} — $${lineTotal.toFixed(2)}`);
    }

    console.log(`\n   Subtotal: $${subtotal.toFixed(2)}`);

    // 2. Apply coupon
    let discount = 0;
    if (couponCode) {
      try {
        const { data: validation } = await api.post('/api/coupons/validate', {
          code: couponCode,
          purchase_amount: subtotal,
        });

        if (validation.valid) {
          discount = validation.discount_amount;
          console.log(`   Coupon "${couponCode}": -$${discount.toFixed(2)}`);
        } else {
          console.log(`   Coupon "${couponCode}": invalid`);
        }
      } catch {
        console.log(`   Coupon "${couponCode}": not found`);
      }
    }

    const total = subtotal - discount;
    console.log(`   Total:    $${total.toFixed(2)}\n`);

    // 3. Create payment
    const { data: payment } = await api.post('/api/payments', {
      merchant_wallet: process.env.MERCHANT_WALLET,
      amount: total,
      label: `Order from ${customer.name}`,
      reference: `ORDER-${Date.now()}`,
      metadata: {
        customer_email: customer.email,
        customer_name: customer.name,
        items: lineItems.map(i => ({ id: i.product.id, qty: i.quantity })),
        coupon_code: couponCode,
        subtotal,
        discount,
      },
    });

    console.log('✅ Payment created!');
    console.log(`   ID:          ${payment.id}`);
    console.log(`   Payment URL: ${payment.payment_url}`);
    console.log(`   Expires at:  ${payment.expires_at}\n`);

    // 4. Simulate waiting for payment
    console.log('⏳ Waiting for payment (demo: will timeout after 10s)...\n');

    const confirmed = await this.waitForPayment(payment.id, 10000);

    if (confirmed) {
      console.log('🎉 Order fulfilled!');
      await this.fulfillOrder(payment.id, payment.metadata || {});
    } else {
      console.log('ℹ️  Payment not confirmed yet. Use webhooks in production.');
    }

    return payment;
  }

  async waitForPayment(paymentId, timeoutMs = 120000, interval = 3000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      await sleep(interval);
      const { data } = await api.get(`/api/payments/${paymentId}`);
      if (data.status === 'completed') return data;
      if (['failed', 'cancelled', 'expired'].includes(data.status)) return null;
    }
    return null;
  }

  async fulfillOrder(paymentId, metadata) {
    // Simulate fulfillment actions
    console.log(`   → Updating order status for payment ${paymentId}`);
    console.log(`   → Sending confirmation to ${metadata.customer_email || 'customer'}`);
    console.log(`   → Granting product access`);
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Run demo ────────────────────────────────────────────────────────────

const checkout = new Checkout();

checkout.run(
  [
    { productId: 'prod_123', quantity: 2 },
    { productId: 'prod_456', quantity: 1 },
  ],
  { email: 'customer@example.com', name: 'John Doe' },
  'WELCOME10'
).catch(err => {
  console.error('Checkout error:', err.response?.data || err.message);
});
