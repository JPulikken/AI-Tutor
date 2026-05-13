export const getDateKey = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
};

export const getAccuracy = (correct, total) => {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
};

export const toPlainCounts = (mapOrObject) => {
  if (!mapOrObject) return {};

  if (mapOrObject instanceof Map) {
    return Object.fromEntries(mapOrObject.entries());
  }

  if (typeof mapOrObject.toObject === "function") {
    return mapOrObject.toObject();
  }

  return { ...mapOrObject };
};

export const mergeCounts = (base = {}, delta = {}) => {
  const merged = { ...base };
  Object.entries(delta).forEach(([key, value]) => {
    const numeric = Number(value) || 0;
    merged[key] = (merged[key] || 0) + numeric;
  });
  return merged;
};

export const getDominantEmotion = (counts = {}) =>
  Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";

export const summarizeEmotionSamples = (emotions = []) =>
  emotions.reduce((acc, emotion) => {
    if (!emotion) return acc;
    const key = String(emotion).trim().toLowerCase();
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

const positiveEmotions = new Set(["happy", "excited", "curious", "neutral"]);
const negativeEmotions = new Set(["sad", "unhappy", "frustrated", "sleepy"]);

export const detectCalmComeback = (emotions = []) => {
  if (!Array.isArray(emotions) || emotions.length < 4) return false;

  const normalized = emotions
    .map((emotion) => String(emotion || "").trim().toLowerCase())
    .filter(Boolean);

  if (normalized.length < 4) return false;

  const firstHalf = normalized.slice(0, Math.floor(normalized.length / 2));
  const secondHalf = normalized.slice(Math.floor(normalized.length / 2));
  const earlyNegative = firstHalf.filter((emotion) => negativeEmotions.has(emotion)).length;
  const latePositive = secondHalf.filter((emotion) => positiveEmotions.has(emotion)).length;

  return earlyNegative >= 2 && latePositive >= 2;
};

const QUESTS_TEMPLATE = [
  { id: "lesson-explorer", label: "Complete 1 lesson", target: 1, rewardStars: 3 },
  { id: "accuracy-sprint", label: "Get 3 correct answers", target: 3, rewardStars: 4 },
  { id: "focus-time", label: "Practice for 10 minutes", target: 600, rewardStars: 3 },
  { id: "calm-comeback", label: "Calm comeback moment", target: 1, rewardStars: 4 },
];

const buildQuestState = () =>
  QUESTS_TEMPLATE.map((quest) => ({
    ...quest,
    progress: 0,
    completed: false,
  }));

export const ensureDailyQuests = (progress, dateKey = getDateKey()) => {
  if (!progress.gamification) {
    progress.gamification = {};
  }

  if (progress.gamification.questDateKey !== dateKey || !Array.isArray(progress.gamification.dailyQuests) || !progress.gamification.dailyQuests.length) {
    progress.gamification.questDateKey = dateKey;
    progress.gamification.dailyQuests = buildQuestState();
  }

  return progress.gamification.dailyQuests;
};

export const applyQuestProgress = (progress, delta = {}, dateKey = getDateKey()) => {
  const quests = ensureDailyQuests(progress, dateKey);
  let bonusStars = 0;
  const newlyCompleted = [];

  const updatesById = {
    "lesson-explorer": delta.lessons || 0,
    "accuracy-sprint": delta.correctAnswers || 0,
    "focus-time": delta.practiceSeconds || 0,
    "calm-comeback": delta.calmComebacks || 0,
  };

  quests.forEach((quest) => {
    if (!quest || !updatesById[quest.id]) return;

    quest.progress = Math.min(quest.target, (quest.progress || 0) + updatesById[quest.id]);

    if (!quest.completed && quest.progress >= quest.target) {
      quest.completed = true;
      newlyCompleted.push(quest.id);
      bonusStars += quest.rewardStars || 0;
    }
  });

  if (bonusStars > 0) {
    progress.totalStars = (progress.totalStars || 0) + bonusStars;
    progress.gamification.totalQuestBonuses = (progress.gamification.totalQuestBonuses || 0) + bonusStars;
  }

  return { bonusStars, newlyCompleted };
};

const upsertDailyRow = (rows, dateKey, delta) => {
  const index = rows.findIndex((row) => row.dateKey === dateKey);
  const row = index >= 0
    ? rows[index]
    : {
      dateKey,
      sessions: 0,
      totalPracticeTime: 0,
      totalExercises: 0,
      correctAnswers: 0,
      accuracy: 0,
    };

  row.sessions += delta.sessions || 0;
  row.totalPracticeTime += delta.totalPracticeTime || 0;
  row.totalExercises += delta.totalExercises || 0;
  row.correctAnswers += delta.correctAnswers || 0;
  row.accuracy = getAccuracy(row.correctAnswers, row.totalExercises);

  if (index >= 0) {
    rows[index] = row;
  } else {
    rows.push(row);
  }

  rows.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  return rows.slice(-21);
};

const upsertChildDailyRow = (rows, dateKey, delta) => {
  const index = rows.findIndex((row) => row.dateKey === dateKey);
  const row = index >= 0
    ? rows[index]
    : {
      dateKey,
      sessions: 0,
      totalPracticeTime: 0,
      totalExercises: 0,
      correctAnswers: 0,
      accuracy: 0,
    };

  row.sessions += delta.sessions || 0;
  row.totalPracticeTime += delta.totalPracticeTime || 0;
  row.totalExercises += delta.totalExercises || 0;
  row.correctAnswers += delta.correctAnswers || 0;
  row.accuracy = getAccuracy(row.correctAnswers, row.totalExercises);

  if (index >= 0) {
    rows[index] = row;
  } else {
    rows.push(row);
  }

  rows.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  return rows.slice(-7);
};

const ensureHourlySessions = (hourlySessions = []) => {
  if (!Array.isArray(hourlySessions) || hourlySessions.length !== 24) {
    return Array(24).fill(0);
  }
  return [...hourlySessions];
};

export const updateProgressAnalyticsFromSession = (progress, payload) => {
  const {
    childId,
    totalTime,
    totalExercises,
    correctAnswers,
    emotionSummary,
    createdAt = new Date(),
  } = payload;

  if (!progress.analytics) {
    progress.analytics = {};
  }

  const analytics = progress.analytics;
  analytics.totalSessions = (analytics.totalSessions || 0) + 1;
  analytics.totalPracticeTime = (analytics.totalPracticeTime || 0) + totalTime;
  analytics.totalExercises = (analytics.totalExercises || 0) + totalExercises;
  analytics.correctAnswers = (analytics.correctAnswers || 0) + correctAnswers;
  analytics.accuracy = getAccuracy(analytics.correctAnswers, analytics.totalExercises);
  analytics.emotionTotals = mergeCounts(toPlainCounts(analytics.emotionTotals), emotionSummary);
  analytics.hourlySessions = ensureHourlySessions(analytics.hourlySessions);

  const hour = new Date(createdAt).getHours();
  analytics.hourlySessions[hour] = (analytics.hourlySessions[hour] || 0) + 1;

  const dateKey = getDateKey(createdAt);
  analytics.dailyStats = upsertDailyRow(
    Array.isArray(analytics.dailyStats) ? analytics.dailyStats : [],
    dateKey,
    {
      sessions: 1,
      totalPracticeTime: totalTime,
      totalExercises,
      correctAnswers,
    }
  );

  const childStats = Array.isArray(analytics.childStats) ? analytics.childStats : [];
  const childIndex = childStats.findIndex((item) => item.childId === childId);
  const child = childIndex >= 0
    ? childStats[childIndex]
    : {
      childId,
      sessions: 0,
      totalPracticeTime: 0,
      totalExercises: 0,
      correctAnswers: 0,
      accuracy: 0,
      dominantEmotion: "neutral",
      emotionTotals: {},
      lastSessionAt: null,
      lastSevenDays: [],
    };

  child.sessions = (child.sessions || 0) + 1;
  child.totalPracticeTime = (child.totalPracticeTime || 0) + totalTime;
  child.totalExercises = (child.totalExercises || 0) + totalExercises;
  child.correctAnswers = (child.correctAnswers || 0) + correctAnswers;
  child.accuracy = getAccuracy(child.correctAnswers, child.totalExercises);
  child.emotionTotals = mergeCounts(toPlainCounts(child.emotionTotals), emotionSummary);
  child.dominantEmotion = getDominantEmotion(child.emotionTotals);
  child.lastSessionAt = new Date(createdAt);
  child.lastSevenDays = upsertChildDailyRow(Array.isArray(child.lastSevenDays) ? child.lastSevenDays : [], dateKey, {
    sessions: 1,
    totalPracticeTime: totalTime,
    totalExercises,
    correctAnswers,
  });

  if (childIndex >= 0) {
    childStats[childIndex] = child;
  } else {
    childStats.push(child);
  }

  analytics.childStats = childStats;
  progress.analytics = analytics;
};

export const applyCalmComebackReward = (progress, hasCalmComeback) => {
  if (!hasCalmComeback) return 0;

  if (!progress.gamification) progress.gamification = {};
  progress.gamification.calmComebacks = (progress.gamification.calmComebacks || 0) + 1;
  progress.totalStars = (progress.totalStars || 0) + 2;
  return 2;
};

export const getBestLearningHour = (hourlySessions = []) => {
  if (!Array.isArray(hourlySessions) || !hourlySessions.length) return null;
  let bestIndex = 0;

  hourlySessions.forEach((value, index) => {
    if (value > (hourlySessions[bestIndex] || 0)) {
      bestIndex = index;
    }
  });

  return {
    hour: bestIndex,
    sessions: hourlySessions[bestIndex] || 0,
  };
};
