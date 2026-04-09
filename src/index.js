const { pollTierActivations } = require("./listeners/tierActivationListener");

const INTERVAL_MS = 10_000; // every 10s

async function main() {
  console.log("Codex System Listener started (TierActivations)");

  async function poll() {
    await pollTierActivations();
    setTimeout(poll, INTERVAL_MS);
  }

  await poll();
}

main().catch((err) => {
  console.error("Fatal error in Codex System Listener:", err);
  process.exit(1);
});
