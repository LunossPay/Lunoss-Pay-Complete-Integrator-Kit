<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Lunoss Pay</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<style>
  :root {
    --lime: #BFFF00;
    --lime-dim: #A3E000;
    --lime-glow: #CEFF33;
    --black: #080C07;
    --surface: #0E1410;
    --surface-2: #152018;
    --surface-3: #1C2E20;
    --border: #2A3D2C;
    --muted: #5A7A5C;
    --text: #D4E8D5;
    --text-dim: #8FAF90;
    --sol-purple: #9945FF;
    --sol-green: #14F195;
    --amber: #FFB800;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* ── Noise overlay ── */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1000;
    opacity: 0.4;
  }

  /* ── Glow orbs ── */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
    animation: orbFloat 12s ease-in-out infinite;
  }
  .orb-1 { width: 500px; height: 500px; background: rgba(191,255,0,0.05); top: -100px; right: -100px; animation-delay: 0s; }
  .orb-2 { width: 400px; height: 400px; background: rgba(153,69,255,0.06); bottom: 10%; left: -80px; animation-delay: -5s; }
  .orb-3 { width: 300px; height: 300px; background: rgba(20,241,149,0.04); top: 50%; right: 20%; animation-delay: -8s; }

  @keyframes orbFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-30px) scale(1.05); }
  }

  /* ── Layout ── */
  .wrapper {
    position: relative;
    z-index: 1;
    max-width: 860px;
    margin: 0 auto;
    padding: 0 32px 120px;
  }

  /* ── Hero ── */
  .hero {
    padding: 100px 0 80px;
    animation: fadeUp 0.8s ease both;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 6px 16px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--lime);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 36px;
  }
  .badge-dot {
    width: 7px; height: 7px;
    background: var(--lime);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }

  h1 {
    font-size: clamp(48px, 8vw, 80px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: #fff;
    margin-bottom: 12px;
  }
  h1 span { color: var(--lime); }

  .hero-sub {
    font-size: 20px;
    color: var(--text-dim);
    font-weight: 400;
    margin-bottom: 48px;
    max-width: 560px;
    line-height: 1.6;
  }
  .hero-sub strong { color: var(--text); font-weight: 600; }

  .hero-cta {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    align-items: center;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 24px;
    border-radius: 8px;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .btn-primary {
    background: var(--lime);
    color: var(--black);
    border: none;
  }
  .btn-primary:hover {
    background: var(--lime-glow);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(191,255,0,0.25);
  }
  .btn-ghost {
    background: transparent;
    color: var(--text-dim);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover {
    border-color: var(--muted);
    color: var(--text);
    transform: translateY(-2px);
  }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 64px 0;
  }

  /* ── Section ── */
  section {
    margin-bottom: 80px;
    animation: fadeUp 0.7s ease both;
  }

  h2 {
    font-size: 13px;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--lime);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  h2::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  p {
    color: var(--text-dim);
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 16px;
  }
  p strong { color: var(--text); font-weight: 600; }

  .lead {
    font-size: 18px;
    color: var(--text);
    font-weight: 600;
    margin-bottom: 20px;
  }

  /* ── Status grid ── */
  .status-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 8px;
  }
  @media (max-width: 600px) { .status-grid { grid-template-columns: 1fr; } }

  .status-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px 24px;
    transition: border-color 0.2s;
  }
  .status-card:hover { border-color: var(--muted); }

  .status-card h3 {
    font-size: 12px;
    font-family: 'Space Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 14px;
    color: var(--text-dim);
  }

  .status-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    color: var(--text-dim);
    padding: 5px 0;
    line-height: 1.4;
  }
  .status-item .icon { flex-shrink: 0; font-size: 13px; margin-top: 1px; }
  .status-item.live { color: var(--text); }
  .status-item.live .icon { filter: drop-shadow(0 0 4px rgba(191,255,0,0.6)); }

  /* ── Code block ── */
  .code-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin: 24px 0;
    transition: border-color 0.2s;
  }
  .code-wrap:hover { border-color: var(--muted); }

  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--surface-2);
  }
  .code-dots { display: flex; gap: 6px; }
  .code-dot { width: 10px; height: 10px; border-radius: 50%; }
  .code-dot:nth-child(1) { background: #FF5F57; }
  .code-dot:nth-child(2) { background: #FFBD2E; }
  .code-dot:nth-child(3) { background: #28CA41; }

  .code-lang {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  pre {
    padding: 24px;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    line-height: 1.8;
    color: var(--text);
    overflow-x: auto;
    tab-size: 2;
  }

  .kw { color: #FF79C6; }
  .str { color: var(--lime-dim); }
  .var { color: #8BE9FD; }
  .cmt { color: var(--muted); font-style: italic; }
  .key { color: #FFB86C; }
  .num { color: var(--sol-green); }
  .url { color: var(--sol-purple); }

  /* ── Kit table ── */
  .kit-grid {
    display: grid;
    gap: 10px;
    margin-top: 8px;
  }
  .kit-row {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 16px;
    align-items: center;
    padding: 14px 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    transition: all 0.2s;
  }
  .kit-row:hover {
    border-color: var(--lime);
    background: var(--surface-2);
    transform: translateX(4px);
  }
  .kit-path {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: var(--lime-dim);
  }
  .kit-desc {
    font-size: 14px;
    color: var(--text-dim);
  }

  /* ── Philosophy ── */
  .philosophy-block {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-left: 3px solid var(--lime);
    border-radius: 0 12px 12px 0;
    padding: 28px 32px;
    margin: 24px 0;
  }
  .philosophy-block p {
    font-size: 18px;
    color: var(--text);
    font-weight: 500;
    margin: 0;
    line-height: 1.7;
  }
  .philosophy-block p + p {
    margin-top: 16px;
    font-size: 15px;
    color: var(--text-dim);
    font-weight: 400;
  }

  /* ── Links ── */
  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-top: 8px;
  }
  .link-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.2s;
  }
  .link-card:hover {
    border-color: var(--lime);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .link-card .label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .link-card .value {
    font-size: 14px;
    color: var(--text);
    font-weight: 600;
  }

  /* ── Footer ── */
  footer {
    padding-top: 48px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  .footer-brand {
    font-weight: 800;
    font-size: 18px;
    color: #fff;
  }
  .footer-brand span { color: var(--lime); }
  .footer-note {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.06em;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  section:nth-child(1) { animation-delay: 0.1s; }
  section:nth-child(2) { animation-delay: 0.2s; }
  section:nth-child(3) { animation-delay: 0.3s; }
  section:nth-child(4) { animation-delay: 0.4s; }
  section:nth-child(5) { animation-delay: 0.5s; }
  section:nth-child(6) { animation-delay: 0.6s; }
  section:nth-child(7) { animation-delay: 0.7s; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--muted); }
</style>
</head>
<body>

<div class="orb orb-1"></div>
<div class="orb orb-2"></div>
<div class="orb orb-3"></div>

<div class="wrapper">

  <!-- Hero -->
  <div class="hero">
    <div class="badge">
      <span class="badge-dot"></span>
      Active development · Shipping continuously
    </div>
    <h1>Lunoss<span>Pay</span></h1>
    <p class="hero-sub">
      Solana payments. Built for builders.<br>
      <strong>The infrastructure layer crypto commerce has been missing.</strong>
    </p>
    <div class="hero-cta">
      <a href="https://app.lunosspay.com" class="btn btn-primary">Get API Key →</a>
      <a href="https://docs.lunosspay.com" class="btn btn-ghost">Read the docs</a>
    </div>
  </div>

  <div class="divider"></div>

  <!-- What we're building -->
  <section>
    <h2>What we're building</h2>
    <p>Crypto payments today are broken. Wallets are fragmented. Confirmation flows are guesswork. Most "payment solutions" are glorified QR code generators that leave you to figure out the hard parts yourself.</p>
    <p class="lead">We're fixing that.</p>
    <p>Lunoss Pay gives you a single API that handles the entire payment lifecycle — from creating a Solana Pay request to confirming the transaction on-chain, triggering your webhook, and handing back structured data you can actually use.</p>
    <p><strong>The result:</strong> you integrate once, and payments just work.</p>
  </section>

  <!-- Status -->
  <section>
    <h2>Where we are</h2>
    <p>This is an active project. The core is built and running.</p>
    <div class="status-grid">
      <div class="status-card">
        <h3>Live today</h3>
        <div class="status-item live"><span class="icon">✅</span> Payment creation + QR Code</div>
        <div class="status-item live"><span class="icon">✅</span> Real-time on-chain confirmation</div>
        <div class="status-item live"><span class="icon">✅</span> Webhooks + HMAC verification</div>
        <div class="status-item live"><span class="icon">✅</span> Products & coupon validation</div>
        <div class="status-item live"><span class="icon">✅</span> Organizations + role-based access</div>
        <div class="status-item live"><span class="icon">✅</span> Audit logs & compliance reports</div>
        <div class="status-item live"><span class="icon">✅</span> Authorization rules & approvals</div>
        <div class="status-item live"><span class="icon">✅</span> Full REST API + TypeScript SDK</div>
      </div>
      <div class="status-card">
        <h3>In progress</h3>
        <div class="status-item"><span class="icon">🔄</span> Subscription billing</div>
        <div class="status-item"><span class="icon">🔄</span> On-chain treasury splits</div>
        <div class="status-item"><span class="icon">🔄</span> Merchant dashboard UI</div>
        <div class="status-item"><span class="icon">🔄</span> Hosted payment page</div>
        <div class="status-item"><span class="icon">🔄</span> USDC / USDT support</div>
      </div>
    </div>
  </section>

  <!-- Opportunity -->
  <section>
    <h2>The opportunity</h2>
    <p>The Solana ecosystem processes billions in volume. Yet there's no Stripe equivalent. No clean developer experience. No standard confirmation flow. No production-grade tooling for merchants.</p>
    <p>That's the gap Lunoss Pay is closing.</p>
    <p>We're not building for crypto natives who already know how to handle wallets. We're building for <strong>product teams and developers</strong> who want to add Solana payments to a real product — without becoming blockchain engineers first.</p>
  </section>

  <!-- API -->
  <section>
    <h2>The API in one request</h2>
    <div class="code-wrap">
      <div class="code-header">
        <div class="code-dots"><div class="code-dot"></div><div class="code-dot"></div><div class="code-dot"></div></div>
        <span class="code-lang">bash</span>
      </div>
      <pre><span class="cmt"># Create a payment</span>
<span class="kw">curl</span> -X POST <span class="str">"https://api.lunosspay.com/api/payments"</span> \
  -H <span class="str">"Authorization: Bearer <span class="var">$LUNOSS_API_KEY</span>"</span> \
  -H <span class="str">"Content-Type: application/json"</span> \
  -d <span class="str">'{
    "<span class="key">merchant_wallet</span>": "YOUR_SOLANA_WALLET",
    "<span class="key">amount</span>": <span class="num">9.99</span>,
    "<span class="key">label</span>": "Pro Plan",
    "<span class="key">reference</span>": "ORDER-001",
    "<span class="key">metadata</span>": { "<span class="key">user_id</span>": "usr_123" }
  }'</span></pre>
    </div>
    <p>You get back a QR code, a Solana Pay URL, and a payment ID.<br>
    Your customer pays. We detect it on-chain. We POST to your webhook.<br>
    You fulfill the order. <strong>That's the entire integration surface.</strong></p>
  </section>

  <!-- Kit -->
  <section>
    <h2>What's in this kit</h2>
    <div class="kit-grid">
      <div class="kit-row"><span class="kit-path">docs/QUICKSTART.md</span><span class="kit-desc">First payment in under 5 minutes</span></div>
      <div class="kit-row"><span class="kit-path">docs/API-REFERENCE.md</span><span class="kit-desc">Full endpoint reference</span></div>
      <div class="kit-row"><span class="kit-path">docs/PAYMENT-FLOW.md</span><span class="kit-desc">Full lifecycle: create → confirm → webhook</span></div>
      <div class="kit-row"><span class="kit-path">examples/</span><span class="kit-desc">Copy-paste Node.js and cURL code</span></div>
      <div class="kit-row"><span class="kit-path">scripts/</span><span class="kit-desc">Test credentials & create a live payment</span></div>
      <div class="kit-row"><span class="kit-path">for-devs/sdk/</span><span class="kit-desc">TypeScript SDK — typed, async, retry-ready</span></div>
    </div>
    <div class="code-wrap" style="margin-top:24px;">
      <div class="code-header">
        <div class="code-dots"><div class="code-dot"></div><div class="code-dot"></div><div class="code-dot"></div></div>
        <span class="code-lang">bash</span>
      </div>
      <pre><span class="cmt"># Start here</span>
<span class="kw">cp</span> .env.example .env       <span class="cmt"># add your API key</span>
<span class="kw">npm install</span>
<span class="kw">npm run health</span>             <span class="cmt"># confirm everything works</span>
<span class="kw">npm run test-payment</span>       <span class="cmt"># create your first real payment</span></pre>
    </div>
  </section>

  <!-- Philosophy -->
  <section>
    <h2>Philosophy</h2>
    <div class="philosophy-block">
      <p>The best payment infrastructure is invisible.</p>
      <p>You shouldn't think about RPC nodes, transaction confirmation, or signature verification. You should think about your product. We handle the blockchain. You handle the business logic.</p>
    </div>
  </section>

  <!-- Get involved -->
  <section>
    <h2>Get involved</h2>
    <p>This project is moving fast. If you're a developer who wants early access, wants to contribute, or just wants to follow along — reach out.</p>
    <div class="links-grid">
      <a href="https://app.lunosspay.com" class="link-card">
        <span class="label">Dashboard</span>
        <span class="value">app.lunosspay.com</span>
      </a>
      <a href="https://docs.lunosspay.com" class="link-card">
        <span class="label">Docs</span>
        <span class="value">docs.lunosspay.com</span>
      </a>
      <a href="mailto:dev@lunosspay.com" class="link-card">
        <span class="label">Email</span>
        <span class="value">dev@lunosspay.com</span>
      </a>
      <a href="https://discord.gg/lunosspay" class="link-card">
        <span class="label">Discord</span>
        <span class="value">discord.gg/lunosspay</span>
      </a>
    </div>
  </section>

  <footer>
    <div class="footer-brand">Lunoss<span>Pay</span></div>
    <div class="footer-note">Solana payment infrastructure · Active development · Shipping continuously</div>
  </footer>

</div>

</body>
</html>
