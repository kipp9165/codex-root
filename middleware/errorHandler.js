function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: "Not found",
    path: req.originalUrl
  });
}

function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: "Internal server error in Codex Root.",
    details: process.env.NODE_ENV === "development" ? String(err) : undefined
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
