import express from "express";
import healthRouter from "./routes/health.js";
import stripeWebhookRouter from "./routes/stripeWebhook.js";
import billingRouter from "./routes/billing.js";

const app = express();

// Stripe webhooks require raw body — mount before express.json()
app.use("/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhookRouter);

app.use(express.json());

app.use("/health", healthRouter);
app.use("/billing", billingRouter);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Codex Root running on port ${PORT}`);
});
server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

export default app;
