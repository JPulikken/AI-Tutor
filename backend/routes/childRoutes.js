import express from "express";
import { createChild, getChildren, updateChild } from "../controllers/childController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", getChildren);
router.post("/", createChild);
router.patch("/:id", updateChild);

export default router;
