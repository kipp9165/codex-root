/**
 * Codex Labs — Full Integration Test Suite
 * Validates all Codex Root API endpoints and the Codex System listener.
 *
 * Run with: npm test
 */

"use strict";

const { test, describe, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

// ─── helpers ──────────────────────────────────────────────────────────────────

let serverInstance;
let BASE;

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {})
      }
    };
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (c) => { data += c; });
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const get  = (path)       => request("GET",  path, null);
const post = (path, body) => request("POST", path, body);

// ─── lifecycle ────────────────────────────────────────────────────────────────

before(async () => {
  // Start on a random free port so we don't clash with a running dev server
  process.env.PORT = "0";
  const { server } = require("../index.js");
  await new Promise((resolve) => server.on("listening", resolve));
  const port = server.address().port;
  BASE = `http://127.0.0.1:${port}`;
  serverInstance = server;
});

after(async () => {
  if (serverInstance) await new Promise((resolve) => serverInstance.close(resolve));
});

// ─── 1. Codex Root API Validation ─────────────────────────────────────────────

describe("1. Codex Root API Validation", () => {
  const TEST_EMAIL = "integration@codexlabs.test";

  // ── 1a. GET /me ────────────────────────────────────────────────────────────
  test("GET /me returns user profile for known email", async () => {
    const { status, body } = await get(`/me?email=${encodeURIComponent(TEST_EMAIL)}`);
    assert.equal(status, 200, `Expected 200, got ${status}`);
    assert.equal(body.email, TEST_EMAIL, "email field must match query param");
    assert.ok(body.tier, "tier field must be present");
    assert.ok(body.stripe_customer_id, "stripe_customer_id must be present");
    assert.ok(body.created_at, "created_at timestamp must be present");
  });

  test("GET /me returns 400 when email is missing", async () => {
    const { status } = await get("/me");
    assert.equal(status, 400);
  });

  // ── 1b. GET /capabilities ─────────────────────────────────────────────────
  test("GET /capabilities returns capability map for known email", async () => {
    const { status, body } = await get(`/capabilities?email=${encodeURIComponent(TEST_EMAIL)}`);
    assert.equal(status, 200);
    assert.equal(body.email, TEST_EMAIL);
    assert.ok(body.tier, "tier must be present");
    assert.ok(body.capabilities, "capabilities map must be present");

    // Confirm capability map structure matches expected fields
    const expectedFields = ["invention_radar", "deersafe", "codex_system", "api_access", "webhooks"];
    for (const field of expectedFields) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(body.capabilities, field),
        `capabilities must contain field: ${field}`
      );
      assert.equal(typeof body.capabilities[field], "boolean", `${field} must be boolean`);
    }
    assert.ok(body.updated_at, "updated_at timestamp must be present");
  });

  test("GET /capabilities returns 400 when email is missing", async () => {
    const { status } = await get("/capabilities");
    assert.equal(status, 400);
  });

  // ── 1c. Stripe checkout session ───────────────────────────────────────────
  test("POST /api/stripe/checkout returns a session URL", async () => {
    const { status, body } = await post("/api/stripe/checkout", {
      email: TEST_EMAIL,
      price_id: "price_test_pro"
    });
    assert.equal(status, 200);
    assert.ok(body.session_id, "session_id must be present");
    assert.ok(body.url, "url must be present");
    assert.match(body.url, /^https:\/\/checkout\.stripe\.com\//, "URL must point to Stripe checkout");
    assert.equal(body.status, "open");
  });

  test("POST /api/stripe/checkout returns 400 when email is missing", async () => {
    const { status } = await post("/api/stripe/checkout", {});
    assert.equal(status, 400);
  });

  // ── 1d. Stripe portal session ─────────────────────────────────────────────
  test("POST /api/stripe/portal returns a portal session URL", async () => {
    const { status, body } = await post("/api/stripe/portal", { email: TEST_EMAIL });
    assert.equal(status, 200);
    assert.ok(body.session_id, "session_id must be present");
    assert.ok(body.url, "url must be present");
    assert.match(body.url, /^https:\/\/billing\.stripe\.com\//, "URL must point to Stripe billing portal");
    assert.equal(body.status, "active");
  });

  test("POST /api/stripe/portal returns 400 when email is missing", async () => {
    const { status } = await post("/api/stripe/portal", {});
    assert.equal(status, 400);
  });

  // ── 1e. Webhook flow ──────────────────────────────────────────────────────
  test("POST /api/webhooks/stripe processes checkout.session.completed and activates tier", async () => {
    const webhookEmail = "webhook@codexlabs.test";
    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          customer_email: webhookEmail,
          metadata: { tier: "pro" }
        }
      }
    };

    // Send webhook
    const { status, body } = await post("/api/webhooks/stripe", event);
    assert.equal(status, 200);
    assert.equal(body.received, true, "webhook must be acknowledged");
    assert.equal(body.processed, true, "webhook must be processed");
    assert.ok(body.tier_activated, "tier_activated must be present");
    assert.equal(body.tier_activated.email, webhookEmail);
    assert.equal(body.tier_activated.tier, "pro");

    // Confirm capability map updated
    const capRes = await get(`/capabilities?email=${encodeURIComponent(webhookEmail)}`);
    assert.equal(capRes.status, 200);
    assert.equal(capRes.body.tier, "pro", "Capability map tier must reflect webhook activation");
    assert.equal(capRes.body.capabilities.invention_radar, true, "Pro tier enables invention_radar");
    assert.equal(capRes.body.capabilities.api_access, true, "Pro tier enables api_access");
  });

  test("POST /api/webhooks/stripe returns 400 for invalid payload", async () => {
    const { status } = await post("/api/webhooks/stripe", {});
    assert.equal(status, 400);
  });

  // ── 1f. Existing Codex Root endpoints ─────────────────────────────────────
  test("GET /api/codex/state returns kernel status", async () => {
    const { status, body } = await get("/api/codex/state");
    assert.equal(status, 200);
    assert.equal(body.kernel.version, "0.7.0");
    assert.equal(body.kernel.status, "online");
    assert.ok(typeof body.kernel.uptime === "number");
  });

  test("GET /api/codex/modules returns module list", async () => {
    const { status, body } = await get("/api/codex/modules");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.modules));
    assert.ok(body.modules.includes("stripe"));
  });

  test("GET /api/codex/integrations returns integration overview", async () => {
    const { status, body } = await get("/api/codex/integrations");
    assert.equal(status, 200);
    assert.ok(body.integrations.stripe);
    assert.ok(body.integrations.hookdeck);
  });

  test("POST /api/codex/hookdeck/connect acknowledges webhook", async () => {
    const { status, body } = await post("/api/codex/hookdeck/connect", { test: true });
    assert.equal(status, 200);
    assert.equal(body.ok, true);
  });
});

// ─── 2. Codex System Listener Validation ──────────────────────────────────────

describe("2. Codex System Listener Validation", () => {
  test("listener module loads without errors", () => {
    assert.doesNotThrow(() => {
      require("../src/listener.js");
    });
  });

  test("listener pollOnce returns capability data when server is running", async () => {
    const listener = require("../src/listener.js");
    // Temporarily point listener at our test server
    const origUrl = process.env.CODEX_ROOT_URL;
    process.env.CODEX_ROOT_URL = BASE;
    process.env.CODEX_TEST_EMAIL = "listener@codexlabs.test";

    const result = await listener.pollOnce();
    assert.equal(result.ok, true, "pollOnce must succeed when server is reachable");
    assert.ok(result.tier, "pollOnce must return a tier");
    assert.ok(result.capabilities, "pollOnce must return capabilities");

    if (origUrl !== undefined) process.env.CODEX_ROOT_URL = origUrl;
    else delete process.env.CODEX_ROOT_URL;
  });

  test("listener start/stop cycle runs without crashing", (t, done) => {
    const listener = require("../src/listener.js");
    process.env.CODEX_ROOT_URL = BASE;
    process.env.CODEX_TEST_EMAIL = "listenercycle@codexlabs.test";
    process.env.POLL_INTERVAL_MS = "100";

    const timer = listener.start(100);
    setTimeout(() => {
      assert.doesNotThrow(() => listener.stop(timer));
      done();
    }, 250);
  });
});

// ─── 3. Invention Radar / Frontend Endpoints ───────────────────────────────────

describe("3. Invention Radar Frontend Validation (API layer)", () => {
  const RADAR_EMAIL = "radar@codexlabs.test";

  test("user email and tier are retrievable from /me", async () => {
    const { status, body } = await get(`/me?email=${encodeURIComponent(RADAR_EMAIL)}`);
    assert.equal(status, 200);
    assert.equal(body.email, RADAR_EMAIL);
    assert.ok(body.stripe_customer_id, "Stripe customer ID must be present for BillingPanel");
  });

  test("capabilities panel data loads from /capabilities", async () => {
    const { status, body } = await get(`/capabilities?email=${encodeURIComponent(RADAR_EMAIL)}`);
    assert.equal(status, 200);
    assert.ok(body.capabilities, "Capabilities panel requires capabilities map");
  });

  test("upgrade flow: checkout session returns URL", async () => {
    const { status, body } = await post("/api/stripe/checkout", {
      email: RADAR_EMAIL,
      price_id: "price_pro"
    });
    assert.equal(status, 200);
    assert.ok(body.url, "Upgrade flow requires a Stripe checkout URL");
  });

  test("upgrade flow: webhook updates tier in capability map", async () => {
    const event = {
      type: "invoice.payment_succeeded",
      data: {
        object: {
          customer_email: RADAR_EMAIL,
          metadata: { tier: "starter" }
        }
      }
    };
    const webhookRes = await post("/api/webhooks/stripe", event);
    assert.equal(webhookRes.status, 200);
    assert.equal(webhookRes.body.processed, true);

    const capRes = await get(`/capabilities?email=${encodeURIComponent(RADAR_EMAIL)}`);
    assert.equal(capRes.body.tier, "starter");
  });
});

// ─── 4. DeerSafe (stub validation) ────────────────────────────────────────────

describe("4. DeerSafe Desktop Validation (dependency checks)", () => {
  test("Node.js runtime version is 18 or higher", () => {
    const major = parseInt(process.versions.node.split(".")[0], 10);
    assert.ok(major >= 18, `Node ${process.versions.node} — 18+ required for full compatibility`);
  });

  test("express dependency is installed and resolvable", () => {
    assert.doesNotThrow(() => require("express"), "express must be installed");
  });
});

// ─── 5. Summary report ────────────────────────────────────────────────────────
// The node:test runner prints a TAP/spec summary automatically.
// The lines below emit an extra human-readable summary to stdout.

after(() => {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║         Codex Labs — Integration Test Summary            ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ Section 1 — Codex Root API           (see results above) ║");
  console.log("║ Section 2 — Codex System Listener    (see results above) ║");
  console.log("║ Section 3 — Invention Radar (API)    (see results above) ║");
  console.log("║ Section 4 — DeerSafe (deps)          (see results above) ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ Missing external services (stubbed, not tested here):    ║");
  console.log("║   • Stripe live keys / Hookdeck endpoint                 ║");
  console.log("║   • Baserow API token + table ID                        ║");
  console.log("║   • DeerSafe Python/Tkinter desktop runtime              ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ Recommended fixes if tests fail:                         ║");
  console.log("║   • Set CODEX_ROOT_URL env var for remote server tests   ║");
  console.log("║   • Provide STRIPE_SECRET_KEY for live Stripe calls      ║");
  console.log("║   • Install Python + Tkinter for DeerSafe desktop tests  ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
});
