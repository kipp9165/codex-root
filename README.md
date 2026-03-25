# Codex Root v1.1

Core backend engine for **Invention Radar** and other Codex Labs systems.

This version adds:

- Real **Stripe TEST-mode** integration for checkout and billing portal
- Verified Stripe webhooks (ready to be routed via Hookdeck)
- Subscription lifecycle handling scaffold
- All v1.0 stability patches preserved

## Environment variables

Set these in your Render / local `.env`:

- `STRIPE_SECRET_KEY` — your Stripe **TEST** secret key (e.g. `sk_test_...`)
- `STRIPE_WEBHOOK_SECRET` — your Stripe **TEST** webhook signing secret (from Stripe or Hookdeck)
- `BILLING_PORTAL_RETURN_URL` — URL to send users back to after managing billing (e.g. your frontend URL)
- `ALLOWED_ORIGINS` — comma-separated list of allowed origins for CORS (optional; defaults to `*`)

## Quick start

```bash
npm install
npm start
```

The server will start on:

- `http://localhost:10000` (locally)
- `process.env.PORT` (in production, e.g. Render)

## Routes

`GET /`
Root / uptime route.

`GET /health`
JSON health check.

`GET /version`
Returns version metadata.

`POST /radar`
Primary Invention Radar entrypoint.

`POST /`
Backwards-compatible alias for `/radar`.

`POST /billing/checkout`
Creates a real Stripe Checkout Session (TEST mode) and returns the `url`.

`GET /billing/portal`
Creates a real Stripe Billing Portal Session (TEST mode) and returns the `url`.

`POST /webhooks/stripe`
Verifies Stripe signature and acknowledges events.
Ready to be wired via Hookdeck as the destination URL.

## Deployment notes

**Render:**

- Build command: `npm install`
- Start command: `node server.js`
- Root Directory: `codex-root` (if monorepo) or repo root if standalone
- Node version: >= 18

Codex Root is intended to grow into a multi-module engine powering Invention Radar, procedural briefs, billing, and real-time invention intelligence.
