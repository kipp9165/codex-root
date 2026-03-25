# Codex Root v1.0

Core backend engine for **Invention Radar** and other Codex Labs systems.

This service is designed to be:

- **Stable**: Modular structure, explicit routes, clear logging.
- **Deployable**: Works out of the box on Render, Vercel functions (via adapter), or any Node host.
- **Extendable**: `/radar` is the primary entrypoint for Invention Radar analysis, with billing and webhooks stubs ready.

## Quick start

```bash
npm install
npm start
```

The server will start on:

- `http://localhost:10000` (locally)
- `process.env.PORT` (in production, e.g. Render)

## Routes

### `GET /`

Root / uptime route.

Response:

```
Codex Root v1.0 is running
```

### `GET /health`

JSON health check.

Example response:

```json
{
  "status": "ok",
  "service": "codex-root",
  "version": "1.0.0",
  "timestamp": "2026-03-24T00:00:00.000Z"
}
```

### `GET /version`

Returns version metadata.

### `POST /radar`

Primary Invention Radar entrypoint.

Request body:

```json
{
  "input": "A system that..."
}
```

Example response (v1.0 placeholder):

```json
{
  "meta": {
    "service": "codex-root",
    "module": "invention-radar",
    "version": "1.0.0",
    "timestamp": "2026-03-24T00:00:00.000Z"
  },
  "input": {
    "raw": "A system that...",
    "length": 16
  },
  "analysis": {
    "noveltyScore": 0.72,
    "riskFlags": [],
    "industryTags": ["UNCLASSIFIED"],
    "confidence": 0.65
  },
  "proceduralBrief": {
    "summary": "This is a v1.0 placeholder procedural brief. The full Invention Radar pipeline will enrich this with legal, technical, and strategic guidance.",
    "recommendedNextSteps": [
      "Clarify the core inventive concept in one sentence.",
      "Identify prior art or similar systems you are aware of.",
      "Decide whether this is patent, trade secret, or publication oriented.",
      "Run a deeper Invention Radar pass once the full pipeline is online."
    ]
  }
}
```

### `POST /`

Backwards-compatible alias for `/radar`.

### `POST /billing/checkout`

Stripe checkout stub. Returns a placeholder URL for now.

### `GET /billing/portal`

Stripe billing portal stub.

### `POST /webhooks/stripe`

Stripe webhook stub. Ready to be wired via Hookdeck.

## Deployment notes

**Render:**

- Build command: `npm install`
- Start command: `node server.js`
- Root Directory: `codex-root` (if monorepo) or repo root if standalone
- Node version: >= 18

Codex Root is intended to grow into a multi-module engine powering Invention Radar, procedural briefs, billing, and real-time invention intelligence.
