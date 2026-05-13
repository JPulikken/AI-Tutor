import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await User.findOne({
      tokens: {
        $elemMatch: {
          token,
          $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    user.tokens = user.tokens.filter((item) => !item.expiresAt || item.expiresAt > new Date());
    await user.save();

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
