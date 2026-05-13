import express from "express";
import { getExercise } from "../controllers/exerciseController.js";

const router = express.Router();

router.get("/", getExercise);

export default router;