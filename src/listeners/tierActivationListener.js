const { fetchRecentTierActivations } = require("../services/baserowClient");
const { handleTierActivation } = require("../services/tierActivationHandler");

let lastSeenTimestamp = null;
let lastSeenId = null;

async function pollTierActivations() {
  try {
    const events = await fetchRecentTierActivations(lastSeenTimestamp);

    for (const ev of events) {
      // Skip the event we already processed last time (gte filter re-fetches it)
      if (ev.id === lastSeenId) continue;

      await handleTierActivation(ev);
      lastSeenTimestamp = ev.timestamp;
      lastSeenId = ev.id;
    }
  } catch (err) {
    console.error("Error polling tier activations:", err);
  }
}

module.exports = { pollTierActivations };
