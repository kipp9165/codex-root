const { fetchRecentTierActivations } = require("../services/baserowClient");
const { handleTierActivation } = require("../services/tierActivationHandler");

let lastSeenTimestamp = null;

async function pollTierActivations() {
  try {
    const events = await fetchRecentTierActivations(lastSeenTimestamp);

    for (const ev of events) {
      lastSeenTimestamp = ev.timestamp;
      try {
        await handleTierActivation(ev);
      } catch (err) {
        console.error("Error handling tier activation event:", err);
      }
    }
  } catch (err) {
    console.error("Error polling tier activations:", err);
  }
}

module.exports = { pollTierActivations };
