import { Router } from "express";
import { findUserByEmail } from "../services/users.js";

const router = Router();

router.get("/", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Missing email" });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    email: user.email,
    tier: user.current_tier,
    stripeCustomerId: user.stripe_customer_id
  });
});

export default router;
