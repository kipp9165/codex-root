const cors = require("cors");

function applyCors(app) {
  // In production, set ALLOWED_ORIGINS to a comma-separated list of allowed origins.
  // e.g. ALLOWED_ORIGINS=https://invention-radar.vercel.app
  // If not set, defaults to "*" for development convenience only.
  const envOrigins = process.env.ALLOWED_ORIGINS;
  const allowedOrigins = envOrigins
    ? envOrigins.split(",").map((o) => o.trim())
    : ["*"];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"), false);
      }
    })
  );
}

module.exports = {
  applyCors
};
