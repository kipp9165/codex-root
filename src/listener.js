/**
 * Codex System Listener
 * Polls the Codex Root API for tier activations and capability map updates.
 */

const http = require("http");

const DEFAULT_URL = "http://localhost:3000";

let running = false;
let pollCount = 0;
let lastTier = null;

function get(path) {
  const baseUrl = process.env.CODEX_ROOT_URL || DEFAULT_URL;
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}${path}`;
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on("error", reject);
  });
}

async function pollOnce() {
  const email = process.env.CODEX_TEST_EMAIL || "test@example.com";
  pollCount++;
  const ts = new Date().toISOString();

  try {
    const capRes = await get(`/capabilities?email=${encodeURIComponent(email)}`);
    const cap = capRes.body;

    if (cap.tier && cap.tier !== lastTier) {
      console.log(`[${ts}] [listener] Tier activation detected: ${lastTier || "none"} → ${cap.tier}`);
      lastTier = cap.tier;
    }

    console.log(`[${ts}] [listener] Poll #${pollCount} — tier: ${cap.tier}, capabilities: ${JSON.stringify(cap.capabilities)}`);
    return { ok: true, tier: cap.tier, capabilities: cap.capabilities };
  } catch (err) {
    console.error(`[${ts}] [listener] Poll #${pollCount} error: ${err.message}`);
    return { ok: false, error: err.message };
  }
}

function start(intervalMs) {
  if (running) return;
  running = true;
  const ms = intervalMs || parseInt(process.env.POLL_INTERVAL_MS || "5000", 10);
  const email = process.env.CODEX_TEST_EMAIL || "test@example.com";
  console.log(`[listener] Starting — polling every ${ms}ms for ${email}`);
  const timer = setInterval(async () => {
    if (!running) {
      clearInterval(timer);
      return;
    }
    await pollOnce();
  }, ms);
  return timer;
}

function stop(timer) {
  running = false;
  if (timer) clearInterval(timer);
  console.log("[listener] Stopped.");
}

module.exports = { start, stop, pollOnce };

// Run standalone when executed directly
if (require.main === module) {
  start();
}
