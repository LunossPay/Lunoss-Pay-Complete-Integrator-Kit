#!/bin/bash
# Lunoss Pay — cURL Examples
# Usage: bash webhook-curl.sh
# Set TOKEN and MERCHANT_WALLET as env vars first.

BASE_URL="https://api.lunosspay.com"
TOKEN="${LUNOSS_API_KEY}"
WALLET="${MERCHANT_WALLET}"

echo "========================================"
echo " Lunoss Pay — cURL Examples"
echo "========================================"

# ── Health Check ──────────────────────────────────────────────────────────
echo -e "\n[1] Health Check"
curl -s "$BASE_URL/health" | python3 -m json.tool 2>/dev/null || echo "(no JSON response)"

# ── Login ─────────────────────────────────────────────────────────────────
echo -e "\n[2] Login"
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "YourPassword123!"
  }' | python3 -m json.tool 2>/dev/null

# ── Create Payment ────────────────────────────────────────────────────────
echo -e "\n[3] Create Payment"
PAYMENT=$(curl -s -X POST "$BASE_URL/api/payments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"merchant_wallet\": \"$WALLET\",
    \"amount\": 0.01,
    \"label\": \"Test Payment\",
    \"message\": \"Payment for Order #001\",
    \"reference\": \"ORDER-$(date +%s)\",
    \"metadata\": {
      \"customer_email\": \"customer@example.com\"
    }
  }")

echo "$PAYMENT" | python3 -m json.tool 2>/dev/null
PAYMENT_ID=$(echo "$PAYMENT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
echo "Payment ID: $PAYMENT_ID"

# ── Get Payment ───────────────────────────────────────────────────────────
if [ -n "$PAYMENT_ID" ]; then
  echo -e "\n[4] Get Payment Status"
  curl -s "$BASE_URL/api/payments/$PAYMENT_ID" \
    -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null
fi

# ── List Payments ─────────────────────────────────────────────────────────
echo -e "\n[5] List Payments (last 10)"
curl -s "$BASE_URL/api/payments?limit=10" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null

# ── Payment Stats ─────────────────────────────────────────────────────────
echo -e "\n[6] Payment Stats"
curl -s "$BASE_URL/api/payments/stats" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null

# ── Validate Coupon ───────────────────────────────────────────────────────
echo -e "\n[7] Validate Coupon"
curl -s -X POST "$BASE_URL/api/coupons/validate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10",
    "purchase_amount": 50.0
  }' | python3 -m json.tool 2>/dev/null

# ── Dashboard ─────────────────────────────────────────────────────────────
echo -e "\n[8] Reports Dashboard"
curl -s "$BASE_URL/api/reports/dashboard" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null

echo -e "\n========================================"
echo " Done!"
echo "========================================"
