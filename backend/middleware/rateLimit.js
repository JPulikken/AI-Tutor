const bucket = new Map();

const buildKey = (req, keyBuilder) => {
  if (typeof keyBuilder === "function") {
    return keyBuilder(req);
  }

  return `${req.ip}:${req.path}`;
};

export const createRateLimit = ({
  windowMs = 15 * 60 * 1000,
  maxAttempts = 30,
  keyBuilder,
  message = "Too many requests. Please wait and try again.",
} = {}) =>
  (req, res, next) => {
    const key = buildKey(req, keyBuilder);
    const now = Date.now();
    const record = bucket.get(key) || { count: 0, resetAt: now + windowMs };

    if (record.resetAt < now) {
      record.count = 0;
      record.resetAt = now + windowMs;
    }

    record.count += 1;
    bucket.set(key, record);

    if (record.count > maxAttempts) {
      return res.status(429).json({ error: message });
    }

    next();
  };

export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  maxAttempts: 12,
  keyBuilder: (req) => `${req.ip}:${req.body?.email || "unknown"}:auth`,
  message: "Too many attempts. Please wait and try again.",
});

export const chatRateLimit = createRateLimit({
  windowMs: 60 * 1000,
  maxAttempts: 20,
  keyBuilder: (req) => `${req.ip}:${req.user?._id || "anon"}:chat`,
  message: "Too many chat requests in a short time. Please pause and retry.",
});

export const reportRateLimit = createRateLimit({
  windowMs: 60 * 1000,
  maxAttempts: 8,
  keyBuilder: (req) => `${req.ip}:${req.user?._id || "anon"}:report`,
});

export const sessionRateLimit = createRateLimit({
  windowMs: 60 * 1000,
  maxAttempts: 15,
  keyBuilder: (req) => `${req.ip}:${req.user?._id || "anon"}:session`,
});
