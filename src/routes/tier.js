import { Router } from "express";
import baserowRequest from "../services/baserow.js";

const router = Router();
const TIER_ACTIVATIONS_TABLE_ID = process.env.BASEROW_TIER_ACTIVATIONS_TABLE_ID;

router.get("/activations", async (req, res) => {
  try {
    const resData = await baserowRequest(
      "GET",
      `/database/rows/table/${TIER_ACTIVATIONS_TABLE_ID}/?user_field_names=true&order_by=-timestamp&size=50`
    );
    res.json(resData.results || []);
  } catch (err) {
    console.error("Error fetching tier activations:", err);
    res.status(500).json({ error: "Unable to fetch tier activations" });
  }
});

export default router;
