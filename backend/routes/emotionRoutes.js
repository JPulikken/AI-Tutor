import express from "express";
import { updateEmotion } from "../controllers/emotionController.js";

const router = express.Router();

router.post("/update", updateEmotion);

export default router;