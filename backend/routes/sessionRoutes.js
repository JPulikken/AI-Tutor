import express from "express";
import { saveSession } from "../controllers/sessionController.js";
import { requireAuth } from "../middleware/auth.js";
import { sessionRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/save", requireAuth, sessionRateLimit, saveSession);

export default router;
