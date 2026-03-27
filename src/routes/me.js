import { Router } from "express";
import { getUserById } from "../services/users.js";
import { getSubscription } from "../services/subscriptions.js";
import { getCapabilitiesForTier } from "../services/capabilities.js";
import { logger } from "../utils/logger.js";

const router = Router();

/**
 * GET /me
 * Returns the current user's profile, subscription tier, and capabilities.
 * Expects req.userId to be set by upstream auth middleware.
 * Falls back to x-user-id header for development convenience.
 */
router.get("/", async (req, res, next) => {
  try {
    const userId = req.userId ?? req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const subscription = await getSubscription(userId);
    const tier = user.field_tier ?? "free";
    const capabilities = getCapabilitiesForTier(tier);

    logger.debug("GET /me", { userId, tier });

    return res.json({
      userId,
      email: user.field_email,
      name: user.field_name,
      tier,
      subscription: subscription
        ? {
            stripeSubscriptionId: subscription.field_stripe_subscription_id,
            status: subscription.field_status,
            currentPeriodEnd: subscription.field_current_period_end,
          }
        : null,
      capabilities,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
