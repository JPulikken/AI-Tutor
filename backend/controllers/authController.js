import crypto from "crypto";
import Progress from "../models/Progress.js";
import User from "../models/User.js";
import { ensureDailyQuests, getDateKey } from "../services/progressInsights.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const createDefaultProgress = (userId) => Progress.create({ userId });
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minPasswordLength = 8;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: "Enter a valid email address" });
    }

    if (password.length < minPasswordLength) {
      return res.status(400).json({ error: `Password must be at least ${minPasswordLength} characters` });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const user = new User({ name: name.trim(), email: email.trim().toLowerCase() });
    user.setPassword(password);
    const token = user.createToken();
    await user.save();

    const progress = await createDefaultProgress(user._id);
    ensureDailyQuests(progress, getDateKey());
    await progress.save();

    res.status(201).json({
      token,
      user: publicUser(user),
      progress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !user.validatePassword(password)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = user.createToken();
    await user.save();

    const progress =
      (await Progress.findOne({ userId: user._id })) || (await createDefaultProgress(user._id));
    ensureDailyQuests(progress, getDateKey());
    await progress.save();

    res.json({
      token,
      user: publicUser(user),
      progress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const progress =
      (await Progress.findOne({ userId: req.user._id })) || (await createDefaultProgress(req.user._id));
    ensureDailyQuests(progress, getDateKey());
    await progress.save();

    res.json({
      user: publicUser(req.user),
      progress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((item) => item.token !== req.token);
    await req.user.save();

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!email || !emailPattern.test(email)) {
      return res.status(400).json({ error: "Enter a valid email address" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If an account exists, password reset instructions were generated.",
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const response = {
      message: "If an account exists, password reset instructions were generated.",
    };

    // Dev helper until email delivery is integrated.
    if (process.env.NODE_ENV !== "production") {
      response.resetToken = resetToken;
    }

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = String(req.body?.token || "").trim();
    const newPassword = String(req.body?.newPassword || "");

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required" });
    }

    if (newPassword.length < minPasswordLength) {
      return res.status(400).json({ error: `Password must be at least ${minPasswordLength} characters` });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    user.setPassword(newPassword);
    user.passwordResetTokenHash = "";
    user.passwordResetExpiresAt = null;
    user.tokens = [];
    const nextToken = user.createToken();
    await user.save();

    const progress =
      (await Progress.findOne({ userId: user._id })) || (await createDefaultProgress(user._id));
    ensureDailyQuests(progress, getDateKey());
    await progress.save();

    res.json({
      message: "Password reset successful",
      token: nextToken,
      user: publicUser(user),
      progress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
