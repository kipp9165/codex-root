function validateRadarInput(req, res, next) {
  const { input } = req.body || {};

  if (!input || typeof input !== "string" || !input.trim()) {
    return res.status(400).json({
      error: "Missing or invalid 'input'. Expected a non-empty string."
    });
  }

  next();
}

module.exports = {
  validateRadarInput
};
