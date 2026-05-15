import mongoose from "mongoose";

const preferencesSchema = new mongoose.Schema(
  {
    fontSize: {
      type: String,
      default: "medium",
    },
    animations: {
      type: Boolean,
      default: true,
    },
    soundEffects: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: "calm-blue",
    },
    autoReadLessons: {
      type: Boolean,
      default: false,
    },
    repeatQuizQuestions: {
      type: Boolean,
      default: true,
    },
    showHints: {
      type: Boolean,
      default: true,
    },
    dailyTimeLimit: {
      type: String,
      default: "2-hours",
    },
    requireBreak: {
      type: Boolean,
      default: true,
    },
    progressReports: {
      type: Boolean,
      default: true,
    },
    anonymousAnalytics: {
      type: Boolean,
      default: false,
    },
    parentPin: {
      type: String,
      default: "1234",
    },
    completedVideos: {
      type: [String],
      default: [],
    },
    teacherGoals: {
      type: [
        {
          id: String,
          title: String,
          topic: String,
          targetLevel: String,
          notes: String,
          completed: {
            type: Boolean,
            default: false,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  { _id: false }
);

const childAnalyticsSchema = new mongoose.Schema(
  {
    childId: {
      type: String,
      required: true,
    },
    sessions: {
      type: Number,
      default: 0,
    },
    totalPracticeTime: {
      type: Number,
      default: 0,
    },
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
    emotionTotals: {
      type: Map,
      of: Number,
      default: {},
    },
    lastSessionAt: {
      type: Date,
      default: null,
    },
    lastSevenDays: {
      type: [
        {
          dateKey: String,
          sessions: Number,
          totalExercises: Number,
          correctAnswers: Number,
          totalPracticeTime: Number,
          accuracy: Number,
        },
      ],
      default: [],
    },
  },
  { _id: false }
);

const dailyAnalyticsSchema = new mongoose.Schema(
  {
    dateKey: {
      type: String,
      required: true,
    },
    sessions: {
      type: Number,
      default: 0,
    },
    totalPracticeTime: {
      type: Number,
      default: 0,
    },
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
  },
  { _id: false }
);

const analyticsSchema = new mongoose.Schema(
  {
    totalSessions: {
      type: Number,
      default: 0,
    },
    totalPracticeTime: {
      type: Number,
      default: 0,
    },
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
    emotionTotals: {
      type: Map,
      of: Number,
      default: {},
    },
    hourlySessions: {
      type: [Number],
      default: () => Array(24).fill(0),
    },
    dailyStats: {
      type: [dailyAnalyticsSchema],
      default: [],
    },
    childStats: {
      type: [childAnalyticsSchema],
      default: [],
    },
  },
  { _id: false }
);

const dailyQuestSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    target: Number,
    progress: {
      type: Number,
      default: 0,
    },
    rewardStars: Number,
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const gamificationSchema = new mongoose.Schema(
  {
    questDateKey: {
      type: String,
      default: "",
    },
    dailyQuests: {
      type: [dailyQuestSchema],
      default: [],
    },
    streakShields: {
      type: Number,
      default: 1,
    },
    calmComebacks: {
      type: Number,
      default: 0,
    },
    totalQuestBonuses: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    completedLessons: {
      type: [String],
      default: [],
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: null,
    },
    achievements: {
      type: [String],
      default: [],
    },
    redeemedRewards: {
      type: [String],
      default: [],
    },
    preferences: {
      type: preferencesSchema,
      default: () => ({}),
    },
    analytics: {
      type: analyticsSchema,
      default: () => ({}),
    },
    gamification: {
      type: gamificationSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);
