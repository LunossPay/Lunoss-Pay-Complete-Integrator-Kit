/**
 * Lunoss Pay — Official TypeScript SDK
 * Version: 1.0.0
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LunossConfig {
  baseURL?: string;
  apiKey?: string;
  token?: string;
  organizationId?: string;
}

export interface Payment {
  id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'expired';
  amount: number;
  qr_code?: string;
  payment_url?: string;
  expires_at?: string;
  transaction_signature?: string;
  confirmed_at?: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentInput {
  merchant_wallet: string;
  amount: number;
  label?: string;
  message?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  stock?: number;
  is_active: boolean;
  metadata?: Record<string, unknown>;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses?: number;
  current_uses: number;
  expires_at?: string;
  is_active: boolean;
}

export interface CouponValidation {
  valid: boolean;
  discount_amount: number;
  final_amount: number;
  coupon?: Coupon;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  country?: string;
  website?: string;
}

export interface WaitOptions {
  maxWaitTime?: number;
  pollInterval?: number;
}

export interface WaitResult {
  success: boolean;
  payment: Payment;
}

// ─── SDK Class ───────────────────────────────────────────────────────────────

export class LunossPaySDK {
  private http: AxiosInstance;
  private organizationId?: string;

  constructor(config: LunossConfig = {}) {
    this.organizationId = config.organizationId;

    this.http = axios.create({
      baseURL: config.baseURL || 'https://api.lunosspay.com',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'X-API-Key': config.apiKey }),
        ...(config.token && { Authorization: `Bearer ${config.token}` }),
      },
    });

    // Auto-retry on 429
    this.http.interceptors.response.use(
      res => res,
      async (error) => {
        if (error.response?.status === 429) {
          const retryAfter = parseInt(error.response.headers['retry-after'] || '2', 10);
          await this.sleep(retryAfter * 1000);
          return this.http.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  setToken(token: string) {
    this.http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setApiKey(apiKey: string) {
    this.http.defaults.headers.common['X-API-Key'] = apiKey;
  }

  setOrganizationId(orgId: string) {
    this.organizationId = orgId;
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private orgId(override?: string): string | undefined {
    return override || this.organizationId;
  }

  // ─── Auth ─────────────────────────────────────────────────────────────────

  async signup(email: string, password: string, fullName: string, extra: Record<string, unknown> = {}) {
    const { data } = await this.http.post('/auth/signup', { email, password, fullName, ...extra });
    return data;
  }

  async login(email: string, password: string) {
    const { data } = await this.http.post('/auth/login', { email, password });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async logout() {
    const { data } = await this.http.post('/auth/logout');
    delete this.http.defaults.headers.common['Authorization'];
    return data;
  }

  async getMe() {
    const { data } = await this.http.get('/auth/me');
    return data;
  }

  async refreshToken() {
    const { data } = await this.http.post('/auth/refresh');
    if (data.token) this.setToken(data.token);
    return data;
  }

  // ─── API Keys ─────────────────────────────────────────────────────────────

  async createApiKey(name: string, environment: 'production' | 'sandbox' = 'production') {
    const { data } = await this.http.post('/api/keys', { name, environment });
    return data;
  }

  async listApiKeys() {
    const { data } = await this.http.get('/api/keys');
    return data;
  }

  async revokeApiKey(keyId: string) {
    const { data } = await this.http.delete(`/api/keys/${keyId}`);
    return data;
  }

  // ─── Payments ─────────────────────────────────────────────────────────────

  async createPayment(input: CreatePaymentInput): Promise<Payment> {
    const { data } = await this.http.post('/api/payments', input);
    return data;
  }

  async getPayment(paymentId: string): Promise<Payment> {
    const { data } = await this.http.get(`/api/payments/${paymentId}`);
    return data;
  }

  async listPayments(params: Record<string, unknown> = {}) {
    const { data } = await this.http.get('/api/payments', { params });
    return data;
  }

  async cancelPayment(paymentId: string) {
    const { data } = await this.http.post(`/api/payments/${paymentId}/cancel`);
    return data;
  }

  async getPaymentStats() {
    const { data } = await this.http.get('/api/payments/stats');
    return data;
  }

  async waitForPayment(paymentId: string, options: WaitOptions = {}): Promise<WaitResult> {
    const { maxWaitTime = 300000, pollInterval = 3000 } = options;
    const start = Date.now();

    while (Date.now() - start < maxWaitTime) {
      const payment = await this.getPayment(paymentId);

      if (payment.status === 'completed') return { success: true, payment };
      if (['failed', 'cancelled', 'expired'].includes(payment.status)) {
        return { success: false, payment };
      }

      await this.sleep(pollInterval);
    }

    const payment = await this.getPayment(paymentId);
    return { success: false, payment };
  }

  // ─── Products ─────────────────────────────────────────────────────────────

  async createProduct(product: Partial<Product>, orgId?: string): Promise<Product> {
    const { data } = await this.http.post('/api/products', product, {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async listProducts(orgId?: string) {
    const { data } = await this.http.get('/api/products', {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async getProduct(productId: string, orgId?: string): Promise<Product> {
    const { data } = await this.http.get(`/api/products/${productId}`, {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async updateProduct(productId: string, updates: Partial<Product>, orgId?: string) {
    const { data } = await this.http.put(`/api/products/${productId}`, updates, {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async deleteProduct(productId: string, orgId?: string) {
    const { data } = await this.http.delete(`/api/products/${productId}`, {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  // ─── Coupons ──────────────────────────────────────────────────────────────

  async createCoupon(coupon: Partial<Coupon>, orgId?: string): Promise<Coupon> {
    const { data } = await this.http.post('/api/coupons', coupon, {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async listCoupons(orgId?: string) {
    const { data } = await this.http.get('/api/coupons', {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async validateCoupon(code: string, purchaseAmount: number, orgId?: string): Promise<CouponValidation> {
    const { data } = await this.http.post('/api/coupons/validate', { code, purchase_amount: purchaseAmount }, {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async updateCoupon(couponId: string, updates: Partial<Coupon>, orgId?: string) {
    const { data } = await this.http.put(`/api/coupons/${couponId}`, updates, {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async deleteCoupon(couponId: string, orgId?: string) {
    const { data } = await this.http.delete(`/api/coupons/${couponId}`, {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  // ─── Organizations ────────────────────────────────────────────────────────

  async createOrganization(name: string, description?: string): Promise<Organization> {
    const { data } = await this.http.post('/api/organizations', { name, description });
    if (data.id) this.setOrganizationId(data.id);
    return data;
  }

  async listOrganizations() {
    const { data } = await this.http.get('/api/organizations');
    return data;
  }

  async getOrganization(orgId: string): Promise<Organization> {
    const { data } = await this.http.get(`/api/organizations/${orgId}`);
    return data;
  }

  async updateOrganization(orgId: string, updates: Partial<Organization>) {
    const { data } = await this.http.put(`/api/organizations/${orgId}`, updates);
    return data;
  }

  // ─── Invites ──────────────────────────────────────────────────────────────

  async createInvite(email: string, role: string, orgId?: string) {
    const { data } = await this.http.post(`/api/organizations/${this.orgId(orgId)}/invites`, { email, role });
    return data;
  }

  async listInvites(orgId?: string) {
    const { data } = await this.http.get(`/api/organizations/${this.orgId(orgId)}/invites`);
    return data;
  }

  async acceptInvite(inviteCode: string) {
    const { data } = await this.http.post(`/api/invites/${inviteCode}/accept`);
    return data;
  }

  async cancelInvite(inviteId: string, orgId?: string) {
    const { data } = await this.http.delete(`/api/organizations/${this.orgId(orgId)}/invites/${inviteId}`);
    return data;
  }

  // ─── Transactions ─────────────────────────────────────────────────────────

  async listTransactions(params: Record<string, unknown> = {}, orgId?: string) {
    const { data } = await this.http.get('/api/transactions', {
      params,
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async getTransaction(txId: string, orgId?: string) {
    const { data } = await this.http.get(`/api/transactions/${txId}`, {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async getTransactionSummary(params: Record<string, unknown> = {}, orgId?: string) {
    const { data } = await this.http.get('/api/transactions/stats', {
      params,
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  // ─── Reports ──────────────────────────────────────────────────────────────

  async getDashboard(orgId?: string) {
    const { data } = await this.http.get('/api/reports/dashboard', {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async getRevenue(params: Record<string, unknown> = {}, orgId?: string) {
    const { data } = await this.http.get('/api/reports/revenue', {
      params,
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  // ─── Webhooks ─────────────────────────────────────────────────────────────

  async createWebhook(url: string, events: string[], secret?: string) {
    const { data } = await this.http.post('/api/webhooks', { url, events, secret });
    return data;
  }

  async listWebhooks() {
    const { data } = await this.http.get('/api/webhooks');
    return data;
  }

  async deleteWebhook(webhookId: string) {
    const { data } = await this.http.delete(`/api/webhooks/${webhookId}`);
    return data;
  }

  async testWebhook(webhookId: string) {
    const { data } = await this.http.post(`/api/webhooks/${webhookId}/test`);
    return data;
  }

  // ─── Approvals ────────────────────────────────────────────────────────────

  async getPendingApprovals(orgId?: string) {
    const { data } = await this.http.get('/api/approvals/pending', {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async approveTransaction(approvalId: string, comment?: string, orgId?: string) {
    const { data } = await this.http.post(`/api/approvals/${approvalId}/approve`, { comment }, {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  async rejectTransaction(approvalId: string, reason: string, orgId?: string) {
    const { data } = await this.http.post(`/api/approvals/${approvalId}/reject`, { reason }, {
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  // ─── Audit ────────────────────────────────────────────────────────────────

  async getAuditLogs(params: Record<string, unknown> = {}, orgId?: string) {
    const { data } = await this.http.get('/api/audit/logs', {
      params,
      headers: { 'X-Organization-Id': this.orgId(orgId) || '' },
    });
    return data;
  }

  // ─── Static: Webhook verification ────────────────────────────────────────

  static verifyWebhookSignature(
    payload: unknown,
    signature: string,
    secret: string
  ): boolean {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
    } catch {
      return false;
    }
  }
}

export default LunossPaySDK;
