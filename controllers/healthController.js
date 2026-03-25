const { getVersionInfo } = require("../utils/version");
const { nowIso } = require("../utils/timestamps");

function handleHealthCheck(req, res) {
  const version = getVersionInfo();

  res.status(200).json({
    status: "ok",
    service: "codex-root",
    version: version.version,
    timestamp: nowIso()
  });
}

module.exports = {
  handleHealthCheck
};
