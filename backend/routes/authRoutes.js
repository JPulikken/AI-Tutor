import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/register", authRateLimit, register);
router.post("/login", authRateLimit, login);
router.post("/request-reset", authRateLimit, requestPasswordReset);
router.post("/reset-password", authRateLimit, resetPassword);
router.get("/me", requireAuth, getCurrentUser);
router.post("/logout", requireAuth, logout);

export default router;
