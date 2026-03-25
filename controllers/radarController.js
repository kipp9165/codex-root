const { runRadarAnalysis } = require("../services/radarEngine");
const { getVersionInfo } = require("../utils/version");
const { nowIso } = require("../utils/timestamps");

async function handleRadarRequest(req, res, next) {
  try {
    const { input } = req.body || {};
    const trimmed = (input || "").trim();

    const analysis = await runRadarAnalysis(trimmed);

    const version = getVersionInfo();

    const response = {
      meta: {
        service: "codex-root",
        module: "invention-radar",
        version: version.version,
        timestamp: nowIso()
      },
      input: {
        raw: trimmed,
        length: trimmed.length
      },
      analysis: analysis.analysis,
      proceduralBrief: analysis.proceduralBrief
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error in handleRadarRequest:", err);
    return next(err);
  }
}

module.exports = {
  handleRadarRequest
};
