import crypto from "crypto";
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: Date,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    passwordSalt: {
      type: String,
      required: true,
    },
    tokens: [tokenSchema],
    passwordResetTokenHash: {
      type: String,
      default: "",
    },
    passwordResetExpiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = function setPassword(password) {
  this.passwordSalt = crypto.randomBytes(16).toString("hex");
  this.passwordHash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 100000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.validatePassword = function validatePassword(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 100000, 64, "sha512")
    .toString("hex");

  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(this.passwordHash, "hex"));
};

userSchema.methods.createToken = function createToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const activeTokens = (this.tokens || []).filter((item) => !item.expiresAt || item.expiresAt > new Date());
  this.tokens = activeTokens.slice(-4);
  this.tokens.push({ token, expiresAt });
  return token;
};

userSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const rawToken = crypto.randomBytes(24).toString("hex");
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 30);

  this.passwordResetTokenHash = hash;
  this.passwordResetExpiresAt = expiresAt;
  return rawToken;
};

export default mongoose.model("User", userSchema);
