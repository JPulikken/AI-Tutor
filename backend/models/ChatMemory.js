import mongoose from "mongoose";

const chatMemorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    childId: {
      type: String,
      required: true,
      index: true,
    },
    summary: {
      type: String,
      default: "",
    },
    goals: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    focusAreas: {
      type: [String],
      default: [],
    },
    preferredStyle: {
      type: String,
      default: "gentle",
    },
    topicCounts: {
      type: Map,
      of: Number,
      default: {},
    },
    recentTurns: {
      type: [
        {
          role: String,
          text: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

chatMemorySchema.index({ userId: 1, childId: 1 }, { unique: true });

export default mongoose.model("ChatMemory", chatMemorySchema);
