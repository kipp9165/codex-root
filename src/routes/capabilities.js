import { Router } from "express";
import { CAPABILITY_MAP, getCapabilitiesForTier } from "../services/capabilities.js";
import { getUserById } from "../services/users.js";
import { logger } from "../utils/logger.js";

const router = Router();

/**
 * GET /capabilities
 * Returns full capability map or capabilities for the authenticated user's tier.
 */
router.get("/", async (req, res, next) => {
  try {
    const userId = req.userId ?? req.headers["x-user-id"];

    if (!userId) {
      // Return public full map when no user context
      return res.json({ capabilityMap: CAPABILITY_MAP });
    }

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const tier = user.field_tier ?? "free";
    const capabilities = getCapabilitiesForTier(tier);

    logger.debug("GET /capabilities", { userId, tier });
    return res.json({ tier, capabilities, capabilityMap: CAPABILITY_MAP });
  } catch (err) {
    next(err);
  }
});

export default router;
