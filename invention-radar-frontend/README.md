# Invention Radar v0.2 — Frontend

A launch-ready Next.js interface for **Codex Root v0.7**.

- Single-page landing + Radar console
- Cinematic radar scan animation
- Multi-pass Radar history
- BLS-style industry classification
- Notion export (copy-to-clipboard brief)
- Stripe billing button (stub, ready for backend)
- Vercel-ready

## Commands

```bash
npm install
npm run dev
```

## Vercel Deployment

Push this folder to a GitHub repo (e.g. `invention-radar-frontend`).

In Vercel:

- New Project → Import the repo
- Framework: Next.js
- Build Command: `next build`
- Output: `.next`
- Deploy — no env vars required for v0.2

Ensure Codex Root backend is reachable at:

```
https://codex-root-v1.onrender.com/radar
```

## Integration Notes

### Hookdeck + Stripe

Wire the `BillingStripeButton` to a backend endpoint like `/billing/checkout` on Codex Root.

Use Hookdeck to route Stripe webhooks → Codex Root `/stripe/webhook`.

### Notion Export

The "Export brief to Notion" button copies a Markdown brief to the clipboard.

Paste directly into a Notion page.

### Industry Classification

Uses simple keyword heuristics mapped to BLS-style sectors.

Replace with a smarter classifier later without changing the UI.
