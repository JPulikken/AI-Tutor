import Notification from "../models/Notification.js";
import Progress from "../models/Progress.js";
import Session from "../models/Session.js";
import {
  applyCalmComebackReward,
  applyQuestProgress,
  detectCalmComeback,
  getAccuracy,
  getDateKey,
  getDominantEmotion,
  summarizeEmotionSamples,
  updateProgressAnalyticsFromSession,
} from "../services/progressInsights.js";

const normalizeEmotion = (emotion) => {
  if (typeof emotion !== "string") return "";
  return emotion.trim().toLowerCase();
};

const normalizeExercise = (exercise, index) => ({
  exerciseId:
    typeof exercise?.exerciseId === "string" && exercise.exerciseId.trim()
      ? exercise.exerciseId.trim()
      : `exercise-${index + 1}`,
  correct: Boolean(exercise?.correct),
});

const normalizeMeta = (meta = {}) => ({
  lessonId: typeof meta.lessonId === "string" ? meta.lessonId.trim() : "",
  category: typeof meta.category === "string" ? meta.category.trim() : "",
  difficultyLevel: typeof meta.difficultyLevel === "string" ? meta.difficultyLevel.trim().toLowerCase() : "medium",
  quizCount: Number(meta.quizCount) || 0,
});

const buildSessionStats = (normalizedEmotions, normalizedExercises) => {
  const emotionSummary = summarizeEmotionSamples(normalizedEmotions);
  const correctAnswers = normalizedExercises.filter((exercise) => exercise.correct).length;
  const totalExercises = normalizedExercises.length;

  return {
    totalExercises,
    correctAnswers,
    accuracy: getAccuracy(correctAnswers, totalExercises),
    dominantEmotion: getDominantEmotion(emotionSummary),
    emotionSummary,
  };
};

const isNegativeDominant = (emotion) => ["sad", "unhappy", "frustrated", "sleepy"].includes(emotion);

const getInstantAlerts = ({ sessionStats, totalTime, calmComeback }) => {
  const alerts = [];
  const emotionSamples = Object.values(sessionStats.emotionSummary).reduce((sum, count) => sum + count, 0);
  const distressSamples =
    (sessionStats.emotionSummary.sad || 0) +
    (sessionStats.emotionSummary.unhappy || 0) +
    (sessionStats.emotionSummary.frustrated || 0);
  const distressPercent = emotionSamples ? Math.round((distressSamples / emotionSamples) * 100) : 0;

  if (sessionStats.totalExercises >= 3 && sessionStats.accuracy < 40 && isNegativeDominant(sessionStats.dominantEmotion)) {
    alerts.push({
      type: "instant-risk",
      severity: "high",
      title: "High Support Needed",
      message: "Low accuracy and emotional strain were detected in a recent session.",
      metadata: {
        accuracy: sessionStats.accuracy,
        dominantEmotion: sessionStats.dominantEmotion,
      },
    });
  }

  if (distressPercent >= 55) {
    alerts.push({
      type: "distress-pattern",
      severity: "warning",
      title: "Distress Pattern Detected",
      message: "Sad/unhappy/frustrated emotions were frequent in this session.",
      metadata: {
        distressPercent,
        dominantEmotion: sessionStats.dominantEmotion,
      },
    });
  }

  if (totalTime >= 1800) {
    alerts.push({
      type: "long-session",
      severity: "info",
      title: "Long Learning Session",
      message: "This session was long. Consider breaks to prevent fatigue.",
      metadata: { totalTime },
    });
  }

  if (calmComeback) {
    alerts.push({
      type: "calm-comeback",
      severity: "info",
      title: "Calm Comeback",
      message: "The child recovered from difficult emotions during this session.",
      metadata: {
        dominantEmotion: sessionStats.dominantEmotion,
      },
    });
  }

  return alerts;
};

const createNotification = async (userId, childId, alert) => {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const duplicate = await Notification.findOne({
    userId,
    childId,
    type: alert.type,
    title: alert.title,
    createdAt: { $gt: twoHoursAgo },
  });

  if (duplicate) return null;

  return Notification.create({
    userId,
    childId,
    type: alert.type,
    severity: alert.severity,
    title: alert.title,
    message: alert.message,
    metadata: alert.metadata || {},
  });
};

export const saveSession = async (req, res) => {
  try {
    const { childId, emotions, exercises, totalTime, meta } = req.body;

    if (!childId) {
      return res.status(400).json({ error: "Child ID is required" });
    }

    const normalizedEmotions = Array.isArray(emotions)
      ? emotions.map(normalizeEmotion).filter(Boolean)
      : [];
    const normalizedExercises = Array.isArray(exercises) ? exercises.map(normalizeExercise) : [];
    const normalizedTotalTime = Number(totalTime) || 0;
    const createdAt = new Date();
    const sessionStats = buildSessionStats(normalizedEmotions, normalizedExercises);
    const calmComeback = detectCalmComeback(normalizedEmotions);

    const newSession = new Session({
      userId: req.user._id,
      childId,
      emotions: normalizedEmotions,
      exercises: normalizedExercises,
      totalTime: normalizedTotalTime,
      stats: sessionStats,
      meta: normalizeMeta(meta),
      createdAt,
      updatedAt: createdAt,
    });
    await newSession.save();

    const progress = (await Progress.findOne({ userId: req.user._id })) || (await Progress.create({ userId: req.user._id }));
    updateProgressAnalyticsFromSession(progress, {
      childId,
      totalTime: normalizedTotalTime,
      totalExercises: sessionStats.totalExercises,
      correctAnswers: sessionStats.correctAnswers,
      emotionSummary: sessionStats.emotionSummary,
      createdAt,
    });

    const calmComebackStars = applyCalmComebackReward(progress, calmComeback);
    const questResult = applyQuestProgress(
      progress,
      {
        correctAnswers: sessionStats.correctAnswers,
        practiceSeconds: normalizedTotalTime,
        calmComebacks: calmComeback ? 1 : 0,
      },
      getDateKey(createdAt)
    );
    await progress.save();

    const instantAlerts = getInstantAlerts({
      sessionStats,
      totalTime: normalizedTotalTime,
      calmComeback,
    });
    const createdNotifications = [];

    for (const alert of instantAlerts) {
      const created = await createNotification(req.user._id, childId, alert);
      if (created) createdNotifications.push(created);
    }

    if (questResult.bonusStars > 0) {
      const questNames = (progress.gamification.dailyQuests || [])
        .filter((quest) => questResult.newlyCompleted.includes(quest.id))
        .map((quest) => quest.label);

      const questNotification = await createNotification(req.user._id, childId, {
        type: "quest-complete",
        severity: "info",
        title: "Daily Quest Complete",
        message: `Quest bonus earned: +${questResult.bonusStars} stars${questNames.length ? ` (${questNames.join(", ")})` : ""}.`,
        metadata: {
          bonusStars: questResult.bonusStars,
          quests: questResult.newlyCompleted,
        },
      });

      if (questNotification) {
        createdNotifications.push(questNotification);
      }
    }

    res.json({
      message: "Session saved successfully",
      stats: {
        totalExercises: sessionStats.totalExercises,
        correctAnswers: sessionStats.correctAnswers,
        accuracy: sessionStats.accuracy,
        dominantEmotion: sessionStats.dominantEmotion,
      },
      rewards: {
        calmComebackStars,
        questBonusStars: questResult.bonusStars,
        totalBonusStars: calmComebackStars + questResult.bonusStars,
      },
      alerts: createdNotifications.map((item) => ({
        id: item._id,
        title: item.title,
        message: item.message,
        severity: item.severity,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
