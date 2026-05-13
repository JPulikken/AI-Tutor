import mongoose from "mongoose";

const sessionStatsSchema = new mongoose.Schema(
  {
    totalExercises: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    dominantEmotion: {
      type: String,
      default: "neutral",
    },
    emotionSummary: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { _id: false }
);

const sessionMetaSchema = new mongoose.Schema(
  {
    lessonId: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    difficultyLevel: {
      type: String,
      default: "medium",
    },
    quizCount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
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
    emotions: {
      type: [String],
      default: [],
    },
    exercises: [
      {
        exerciseId: String,
        correct: Boolean,
      },
    ],
    totalTime: {
      type: Number,
      default: 0,
    },
    stats: {
      type: sessionStatsSchema,
      default: () => ({}),
    },
    meta: {
      type: sessionMetaSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1, childId: 1, createdAt: -1 });

export default mongoose.model("Session", sessionSchema);
