import express from "express";
import { completeLesson, getProgress, updateProgress } from "../controllers/progressController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", getProgress);
router.patch("/", updateProgress);
router.post("/lesson", completeLesson);

export default router;
