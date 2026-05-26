import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get current user profile (already available via auth/me, but keep for consistency)
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// You can add more user-related endpoints here (e.g., update profile, order history)

export default router;
