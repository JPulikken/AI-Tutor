import express from "express";
import { chatWithTutor } from "../controllers/chatController.js";
import { requireAuth } from "../middleware/auth.js";
import { chatRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/", requireAuth, chatRateLimit, chatWithTutor);

export default router;
