import express from "express";
import { getReport, getWeeklyDigest } from "../controllers/reportController.js";
import { requireAuth } from "../middleware/auth.js";
import { reportRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/", requireAuth, reportRateLimit, getReport);
router.post("/weekly-digest", requireAuth, reportRateLimit, getWeeklyDigest);

export default router;
