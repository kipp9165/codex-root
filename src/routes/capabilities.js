import { Router } from "express";
import { findUserByEmail } from "../services/users.js";
import { getCapabilitiesForTier } from "../services/capabilities.js";

const router = Router();

/**
 * GET /capabilities?email=...
 * Returns capabilities for the user based on current_tier.
 */
router.get("/", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Missing email" });

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ error: "User not found" });

  const capabilities = getCapabilitiesForTier(user.current_tier);

  res.json({
    email: user.email,
    tier: user.current_tier,
    capabilities
  });
});

export default router;
