import Progress from "../models/Progress.js";
import { applyQuestProgress, ensureDailyQuests, getDateKey } from "../services/progressInsights.js";

const lessonStars = {
  "colors-1": 5,
  "numbers-1": 10,
  "letters-1": 10,
  "shapes-1": 8,
  "basics-1": 8,
  "social-1": 5,
};

const normalizeProgress = (progress) => ({
  totalStars: progress.totalStars,
  completedLessons: progress.completedLessons,
  currentStreak: progress.currentStreak,
  lastActiveDate: progress.lastActiveDate,
  achievements: progress.achievements,
  redeemedRewards: progress.redeemedRewards,
  preferences: progress.preferences,
  analytics: progress.analytics,
  gamification: progress.gamification,
});

const getOrCreateProgress = async (userId) =>
  (await Progress.findOne({ userId })) || (await Progress.create({ userId }));

const updateStreak = (progress, now = new Date()) => {
  const today = getDateKey(now);
  const lastActive = progress.lastActiveDate ? getDateKey(progress.lastActiveDate) : null;

  if (lastActive === today) return { usedShield: false, shieldEarned: false };

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDateKey(yesterday);
  let usedShield = false;

  if (lastActive === yesterdayKey) {
    progress.currentStreak = (progress.currentStreak || 0) + 1;
  } else {
    const shields = progress.gamification?.streakShields || 0;
    if (lastActive && shields > 0) {
      progress.currentStreak = Math.max(1, progress.currentStreak || 1);
      progress.gamification.streakShields = shields - 1;
      usedShield = true;
    } else {
      progress.currentStreak = 1;
    }
  }

  progress.lastActiveDate = now;
  let shieldEarned = false;

  if (progress.currentStreak > 0 && progress.currentStreak % 7 === 0) {
    if (!progress.gamification) progress.gamification = {};
    progress.gamification.streakShields = (progress.gamification.streakShields || 0) + 1;
    shieldEarned = true;
  }

  return { usedShield, shieldEarned };
};

export const getProgress = async (req, res) => {
  try {
    const progress = await getOrCreateProgress(req.user._id);
    ensureDailyQuests(progress, getDateKey());
    await progress.save();
    res.json({ progress: normalizeProgress(progress) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const allowedFields = ["preferences", "achievements", "redeemedRewards"];
    const progress = await getOrCreateProgress(req.user._id);

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        progress[field] = req.body[field];
      }
    });

    await progress.save();
    res.json({ progress: normalizeProgress(progress) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const completeLesson = async (req, res) => {
  try {
    const { lessonId, stars } = req.body;

    if (!lessonId) {
      return res.status(400).json({ error: "lessonId is required" });
    }

    const progress = await getOrCreateProgress(req.user._id);
    const alreadyCompleted = progress.completedLessons.includes(lessonId);

    if (!alreadyCompleted) {
      progress.completedLessons.push(lessonId);
    }

    const baseStars = Number.isFinite(stars) ? stars : lessonStars[lessonId] || 5;
    const lessonStarsEarned = alreadyCompleted ? Math.max(1, Math.round(baseStars * 0.35)) : baseStars;
    progress.totalStars += lessonStarsEarned;
    const streakResult = updateStreak(progress);
    const questResult = applyQuestProgress(
      progress,
      { lessons: 1 },
      getDateKey()
    );

    await progress.save();

    res.json({
      progress: normalizeProgress(progress),
      alreadyCompleted,
      rewards: {
        lessonStarsEarned,
        questBonusStars: questResult.bonusStars,
        usedStreakShield: streakResult.usedShield,
        streakShieldEarned: streakResult.shieldEarned,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
