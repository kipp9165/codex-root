"use strict";

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

// ── Helpers ────────────────────────────────────────────────────────────────

function request(server, options, body) {
  return new Promise((resolve, reject) => {
    const { method = "GET", path, headers = {} } = options;
    const addr = server.address();
    const port = addr.port;

    const bodyStr = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };
    if (bodyStr) {
      reqHeaders["Content-Length"] = Buffer.byteLength(bodyStr);
    }

    const req = http.request({ host: "127.0.0.1", port, method, path, headers: reqHeaders }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({ status: res.statusCode, body: parsed });
      });
    });

    req.on("error", reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// ── Test app setup ─────────────────────────────────────────────────────────

let server;

before(async () => {
  // Silence dotenv warning in tests
  process.env.PORT = "0"; // pick random port

  // Load the app but prevent it from starting its own server
  // We create our own server from the express app for isolated testing.
  const express = require("express");
  const cors = require("cors");

  const app = express();

  // Webhooks
  const webhooksRouter = require("../src/routes/webhooks");
  app.use("/webhooks", express.raw({ type: "application/json" }), webhooksRouter);

  app.use(cors());
  app.use(express.json());

  app.use("/me", require("../src/routes/me"));
  app.use("/capabilities", require("../src/routes/capabilities"));
  app.use("/stripe", require("../src/routes/stripe"));
  app.use("/tier", require("../src/routes/tier"));
  app.use("/capability-map", require("../src/routes/capabilityMap"));
  app.use("/events", require("../src/routes/events"));
  app.use("/system", require("../src/routes/system"));

  app.get("/", (req, res) => res.send("OK"));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, _next) => {
    const status = err.statusCode || err.status || 500;
    res.status(status).json({ error: err.name || "Error", message: err.message });
  });

  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, "127.0.0.1", resolve);
  });
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve()))
  );
});

// ── /me ───────────────────────────────────────────────────────────────────

describe("/me", () => {
  it("returns 401 when x-user-id header is missing", async () => {
    const res = await request(server, { path: "/me" });
    assert.equal(res.status, 401);
    assert.equal(res.body.ok, undefined);
  });

  it("returns user identity when x-user-id is provided", async () => {
    const res = await request(server, {
      path: "/me",
      headers: { "x-user-id": "user-123", "x-user-email": "test@example.com", "x-user-tier": "pro" },
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.user.userId, "user-123");
    assert.equal(res.body.user.tier, "pro");
  });
});

// ── /capabilities ─────────────────────────────────────────────────────────

describe("/capabilities", () => {
  it("returns capabilities for the free tier by default", async () => {
    const res = await request(server, { path: "/capabilities" });
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.tier, "free");
    assert.ok(Array.isArray(res.body.capabilities));
  });

  it("returns capabilities for a specific tier via header", async () => {
    const res = await request(server, {
      path: "/capabilities",
      headers: { "x-user-tier": "pro" },
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.tier, "pro");
    assert.ok(res.body.capabilities.length > 0);
  });

  it("returns capabilities for a tier via query string", async () => {
    const res = await request(server, { path: "/capabilities?tier=enterprise" });
    assert.equal(res.status, 200);
    assert.equal(res.body.tier, "enterprise");
  });
});

// ── /stripe ───────────────────────────────────────────────────────────────

describe("/stripe/create-checkout-session", () => {
  it("returns 400 when priceId is missing", async () => {
    const res = await request(server, { method: "POST", path: "/stripe/create-checkout-session" }, {});
    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes("priceId"));
  });

  it("returns 500-level error when Stripe is not configured", async () => {
    const res = await request(
      server,
      { method: "POST", path: "/stripe/create-checkout-session" },
      { priceId: "price_test_123" }
    );
    // Stripe key not set in tests → service throws → error handler returns 500
    assert.ok(res.status >= 400);
  });
});

describe("/stripe/create-portal-session", () => {
  it("returns 400 when customerId is missing", async () => {
    const res = await request(server, { method: "POST", path: "/stripe/create-portal-session" }, {});
    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes("customerId"));
  });
});

// ── /tier/resolve ─────────────────────────────────────────────────────────

describe("/tier/resolve", () => {
  it("resolves the free tier by default (GET)", async () => {
    const res = await request(server, { path: "/tier/resolve" });
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.resolved.tier, "free");
  });

  it("resolves an active tier via POST body", async () => {
    const res = await request(
      server,
      { method: "POST", path: "/tier/resolve" },
      { tier: "pro", subscriptionStatus: "active" }
    );
    assert.equal(res.status, 200);
    assert.equal(res.body.resolved.tier, "pro");
    assert.equal(res.body.resolved.active, true);
  });

  it("falls back to free for unknown tier", async () => {
    const res = await request(
      server,
      { method: "POST", path: "/tier/resolve" },
      { tier: "unknown_tier" }
    );
    assert.equal(res.status, 200);
    assert.equal(res.body.resolved.tier, "free");
  });
});

// ── /capability-map ───────────────────────────────────────────────────────

describe("/capability-map/load", () => {
  it("returns the full capability map", async () => {
    const res = await request(server, { path: "/capability-map/load" });
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.ok(res.body.map.free);
    assert.ok(res.body.map.pro);
    assert.ok(res.body.map.enterprise);
  });

  it("returns capabilities for a specific tier via path param", async () => {
    const res = await request(server, { path: "/capability-map/load/starter" });
    assert.equal(res.status, 200);
    assert.equal(res.body.tier, "starter");
    assert.ok(Array.isArray(res.body.capabilities));
  });
});

// ── /events/log ───────────────────────────────────────────────────────────

describe("/events/log", () => {
  it("returns 400 when type is missing", async () => {
    const res = await request(server, { method: "POST", path: "/events/log" }, { userId: "u1" });
    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes("type"));
  });

  it("records an event and returns 201", async () => {
    const res = await request(
      server,
      { method: "POST", path: "/events/log" },
      { type: "test.event", userId: "u1", payload: { foo: "bar" }, source: "test" }
    );
    assert.equal(res.status, 201);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.event.type, "test.event");
    // Baserow not configured in tests → stored should be false
    assert.equal(res.body.stored, false);
  });
});

// ── /system/listener/ping ─────────────────────────────────────────────────

describe("/system/listener/ping", () => {
  it("returns system status", async () => {
    const res = await request(server, { path: "/system/listener/ping" });
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.ok(res.body.codexRoot);
    assert.equal(res.body.codexRoot.status, "online");
    // Listener URL not configured in tests
    assert.equal(res.body.listener.connected, false);
  });
});

// ── /webhooks/stripe ──────────────────────────────────────────────────────

describe("/webhooks/stripe", () => {
  it("returns 400 when stripe-signature header is missing", async () => {
    const res = await request(server, { method: "POST", path: "/webhooks/stripe" });
    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes("stripe-signature"));
  });
});

// ── tierService ───────────────────────────────────────────────────────────

describe("tierService", () => {
  const { resolveTier, tierRank, TIER_HIERARCHY } = require("../src/services/tierService");

  it("resolves an active subscription correctly", () => {
    const result = resolveTier({ tier: "enterprise", subscriptionStatus: "active" });
    assert.equal(result.tier, "enterprise");
    assert.equal(result.active, true);
    assert.equal(result.source, "stripe");
  });

  it("falls back when subscription is not active", () => {
    const result = resolveTier({ tier: "pro", subscriptionStatus: "canceled" });
    assert.equal(result.active, false);
    assert.equal(result.source, "fallback");
  });

  it("returns tier rank correctly", () => {
    assert.ok(tierRank("enterprise") > tierRank("pro"));
    assert.ok(tierRank("pro") > tierRank("starter"));
    assert.ok(tierRank("starter") > tierRank("free"));
  });

  it("TIER_HIERARCHY has expected values", () => {
    assert.deepEqual(TIER_HIERARCHY, ["free", "starter", "pro", "enterprise"]);
  });
});

// ── capabilityMapService ──────────────────────────────────────────────────

describe("capabilityMapService", () => {
  const { getCapabilitiesForTier } = require("../src/services/capabilityMapService");

  it("returns capabilities for free tier", async () => {
    const caps = await getCapabilitiesForTier("free");
    assert.ok(Array.isArray(caps));
    assert.ok(caps.length > 0);
  });

  it("enterprise capabilities are a superset of free", async () => {
    const free = await getCapabilitiesForTier("free");
    const enterprise = await getCapabilitiesForTier("enterprise");
    for (const cap of free) {
      assert.ok(enterprise.includes(cap), `enterprise should include free cap: ${cap}`);
    }
  });

  it("falls back to free tier for unknown tier", async () => {
    const fallback = await getCapabilitiesForTier("unknown");
    const free = await getCapabilitiesForTier("free");
    assert.deepEqual(fallback, free);
  });
});
