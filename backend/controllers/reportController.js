import Session from "../models/Session.js";
import Notification from "../models/Notification.js";

const trackedEmotions = [
  "happy",
  "neutral",
  "sad",
  "unhappy",
  "frustrated",
  "excited",
  "curious",
  "sleepy",
  "surprised",
];

const formatMinutes = (seconds = 0) => {
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) return "less than 1 minute";
  if (minutes === 1) return "1 minute";
  return `${minutes} minutes`;
};

const getAccuracy = (correct, total) => {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
};

const getAccuracySummary = (accuracy) => {
  if (accuracy >= 85) return "Strong understanding";
  if (accuracy >= 65) return "Developing well";
  if (accuracy >= 40) return "Needs guided practice";
  return "Needs extra support";
};

const getEmotionSummary = (emotion) => {
  const summaries = {
    happy: "The child seemed engaged and comfortable during most recorded moments.",
    neutral: "The child appeared steady, with room to add more motivating prompts.",
    sad: "The child may benefit from reassurance, breaks, or gentler task pacing.",
    unhappy: "The child may benefit from reassurance, breaks, or gentler task pacing.",
    frustrated: "The child may need easier steps, shorter tasks, and more encouragement.",
    surprised: "The child showed moments of high reaction or curiosity.",
    excited: "The child showed strong positive engagement and energy.",
    curious: "The child showed interest and exploratory behavior.",
    sleepy: "The child may be tired and could benefit from rest or shorter sessions.",
  };

  return summaries[emotion] || "Emotional signals were mixed across sessions.";
};

const getTrendSummary = (recentAccuracy, overallAccuracy) => {
  const diff = recentAccuracy - overallAccuracy;

  if (Math.abs(diff) <= 5) {
    return "Recent performance is steady compared with the overall average.";
  }

  if (diff > 5) {
    return `Recent sessions improved by ${diff} percentage points compared with the overall average.`;
  }

  return `Recent sessions dipped by ${Math.abs(diff)} percentage points compared with the overall average.`;
};

const countEmotion = (emotionCount, emotion) => {
  if (!emotion || typeof emotion !== "string") return;
  const key = emotion.trim().toLowerCase();
  if (!key) return;
  emotionCount[key] = (emotionCount[key] || 0) + 1;
};

const buildEmotionMetrics = (emotionCount, totalEmotionSamples) => {
  const knownMetrics = trackedEmotions.map((emotion) => {
    const count = emotionCount[emotion] || 0;
    return {
      emotion,
      count,
      percent: getAccuracy(count, totalEmotionSamples),
    };
  });

  const extraMetrics = Object.entries(emotionCount)
    .filter(([emotion]) => !trackedEmotions.includes(emotion))
    .map(([emotion, count]) => ({
      emotion,
      count,
      percent: getAccuracy(count, totalEmotionSamples),
    }));

  return [...knownMetrics, ...extraMetrics].sort((a, b) => b.count - a.count);
};

const buildExerciseStats = (sessions) => {
  const stats = {};

  sessions.forEach((session) => {
    session.exercises.forEach((exercise) => {
      const id = exercise.exerciseId || "unknown";

      if (!stats[id]) {
        stats[id] = { id, total: 0, correct: 0 };
      }

      stats[id].total += 1;
      if (exercise.correct) {
        stats[id].correct += 1;
      }
    });
  });

  return Object.values(stats).map((exercise) => ({
    ...exercise,
    accuracy: getAccuracy(exercise.correct, exercise.total),
  }));
};

const getExerciseList = (exerciseStats, direction) => {
  const filtered = exerciseStats.filter((exercise) =>
    direction === "strongest" ? exercise.accuracy >= 65 : exercise.accuracy < 65
  );

  const sorted = filtered.sort((a, b) =>
    direction === "strongest" ? b.accuracy - a.accuracy : a.accuracy - b.accuracy
  );

  return sorted
    .slice(0, 3)
    .map((exercise) => `Exercise ${exercise.id}: ${exercise.accuracy}% (${exercise.correct}/${exercise.total})`);
};

const buildRecommendations = ({ accuracy, dominantEmotion, totalSessions, recentAccuracy, overallAccuracy }) => {
  const recommendations = [];

  if (totalSessions < 3) {
    recommendations.push("Collect a few more sessions before making strong progress decisions.");
  }

  if (accuracy < 65) {
    recommendations.push("Use shorter practice sets and repeat missed exercise types with prompts.");
  } else {
    recommendations.push("Keep the current pace and add small challenge increases when the child is comfortable.");
  }

  if (dominantEmotion === "frustrated" || dominantEmotion === "sad" || dominantEmotion === "unhappy" || dominantEmotion === "sleepy") {
    recommendations.push("Add breaks, praise effort, and reduce difficulty when emotional strain appears.");
  } else if (dominantEmotion === "happy") {
    recommendations.push("Use similar lesson formats again, since the child appears engaged.");
  } else {
    recommendations.push("Try adding choices, visuals, or rewards to increase visible engagement.");
  }

  if (recentAccuracy < overallAccuracy - 5) {
    recommendations.push("Review the last few sessions for harder topics or fatigue before moving ahead.");
  }

  return recommendations;
};

const buildAlerts = (emotionMetrics = []) => {
  const alerts = [];
  const byEmotion = emotionMetrics.reduce((map, item) => ({ ...map, [item.emotion]: item.percent }), {});
  const distress = (byEmotion.frustrated || 0) + (byEmotion.sad || 0) + (byEmotion.unhappy || 0);

  if (distress >= 60) {
    alerts.push("High emotional strain detected (sad + unhappy + frustrated). Parent check-in is strongly recommended.");
  } else if (distress >= 45) {
    alerts.push("High emotional strain detected (sad + unhappy + frustrated). Consider reducing difficulty and increasing breaks.");
  }

  if ((byEmotion.sad || 0) >= 35 || (byEmotion.unhappy || 0) >= 35) {
    alerts.push("Frequent sadness signals detected. Consider a supportive check-in and a lighter lesson mix.");
  }

  if ((byEmotion.sleepy || 0) >= 30) {
    alerts.push("Frequent sleepy signals detected. Consider shorter sessions or schedule adjustments.");
  }

  if ((byEmotion.frustrated || 0) >= 35) {
    alerts.push("Frequent frustration detected. Parent support and simpler exercises are recommended.");
  }

  if ((byEmotion.excited || 0) >= 70) {
    alerts.push("Very high excitement detected. Great engagement, but maintain pacing and structure.");
  }

  return alerts;
};

const createDigestNotification = async ({ userId, childId, alerts, summary }) => {
  if (!alerts.length) return null;

  return Notification.create({
    userId,
    childId,
    type: "weekly-digest",
    severity: alerts.length >= 2 ? "warning" : "info",
    title: "Weekly Parent Digest Ready",
    message: summary,
    metadata: {
      alerts,
    },
  });
};

export const getReport = async (req, res) => {
  const { childId, childName } = req.body;

  try {
    const sessions = await Session.find({ userId: req.user._id, childId }).sort({ createdAt: 1 });

    if (!sessions.length) {
      return res.json({
        report: "Progress Report\n\nNo learning sessions have been saved for this child yet.",
      });
    }

    let totalExercises = 0;
    let correctAnswers = 0;
    let totalTime = 0;
    const emotionCount = {};

    sessions.forEach((session) => {
      totalExercises += session.stats?.totalExercises ?? session.exercises.length;
      totalTime += session.totalTime || 0;
      correctAnswers += session.stats?.correctAnswers
        ?? session.exercises.filter((exercise) => exercise.correct).length;

      session.emotions.forEach((emotion) => countEmotion(emotionCount, emotion));
    });

    const recentSessions = sessions.slice(-5);
    const recentTotals = recentSessions.reduce(
      (totals, session) => {
        session.exercises.forEach((exercise) => {
          totals.total += 1;
          if (exercise.correct) totals.correct += 1;
        });
        return totals;
      },
      { total: 0, correct: 0 }
    );

    const accuracy = getAccuracy(correctAnswers, totalExercises);
    const recentAccuracy = getAccuracy(recentTotals.correct, recentTotals.total);
    const dominantEmotion = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
    const totalEmotionSamples = Object.values(emotionCount).reduce((sum, count) => sum + count, 0);
    const emotionMetrics = buildEmotionMetrics(emotionCount, totalEmotionSamples);
    const emotionBreakdown = emotionMetrics
      .filter((item) => item.count > 0)
      .map((item) => `${item.emotion}: ${item.percent}%`)
      .join(", ");
    const exerciseStats = buildExerciseStats(sessions);
    const strengths = getExerciseList(exerciseStats, "strongest");
    const focusAreas = getExerciseList(exerciseStats, "weakest");
    const alerts = buildAlerts(emotionMetrics);
    const recommendations = buildRecommendations({
      accuracy,
      dominantEmotion,
      totalSessions: sessions.length,
      recentAccuracy,
      overallAccuracy: accuracy,
    });

    const report = [
      `Progress Report${childName ? ` for ${childName}` : ""}`,
      "",
      "Overview",
      `- Sessions completed: ${sessions.length}`,
      `- Practice time: ${formatMinutes(totalTime)}`,
      `- Exercises attempted: ${totalExercises}`,
      `- Correct answers: ${correctAnswers}`,
      `- Overall accuracy: ${accuracy}% (${getAccuracySummary(accuracy)})`,
      "",
      "Recent Progress",
      `- Last ${recentSessions.length} session accuracy: ${recentAccuracy}%`,
      `- ${getTrendSummary(recentAccuracy, accuracy)}`,
      "",
      "Engagement",
      `- Most common emotion: ${dominantEmotion}`,
      `- Emotion mix: ${emotionBreakdown || "No emotion samples recorded"}`,
      `- ${getEmotionSummary(dominantEmotion)}`,
      "",
      "Disclaimer",
      "- Emotion detection is an estimate from visual cues and should be reviewed alongside context from caregivers and teachers.",
      "",
      "Strengths",
      ...(strengths.length ? strengths.map((item) => `- ${item}`) : ["- More exercise data is needed."]),
      "",
      "Focus Areas",
      ...(focusAreas.length ? focusAreas.map((item) => `- ${item}`) : ["- More exercise data is needed."]),
      "",
      "Recommended Next Steps",
      ...recommendations.map((item) => `- ${item}`),
      ...(alerts.length
        ? ["", "Parent Alerts", ...alerts.map((item) => `- ${item}`)]
        : ["", "Parent Alerts", "- No extreme emotional patterns were detected in saved sessions."]),
    ].join("\n");

    res.json({
      report,
      metrics: {
        totalSessions: sessions.length,
        totalExercises,
        correctAnswers,
        accuracy,
        recentAccuracy,
        dominantEmotion,
        emotionBreakdown: emotionMetrics.map(({ emotion, percent, count }) => ({ emotion, percent, count })),
        exerciseStats,
        alerts,
        totalEmotionSamples,
        totalTime,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeeklyDigest = async (req, res) => {
  const { childId, childName } = req.body;

  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);

    const sessions = await Session.find({
      userId: req.user._id,
      childId,
      createdAt: { $gte: start, $lte: end },
    }).sort({ createdAt: 1 });

    if (!sessions.length) {
      return res.json({
        digest: `Weekly Digest${childName ? ` for ${childName}` : ""}\n\nNo sessions were saved in the last 7 days.`,
        metrics: {
          sessions: 0,
          accuracy: 0,
          totalPracticeTime: 0,
          dailyStats: [],
          alerts: [],
        },
      });
    }

    let totalExercises = 0;
    let correctAnswers = 0;
    let totalPracticeTime = 0;
    const emotionCount = {};
    const dailyMap = new Map();

    sessions.forEach((session) => {
      const sessionTotal = session.stats?.totalExercises ?? session.exercises.length;
      const sessionCorrect = session.stats?.correctAnswers
        ?? session.exercises.filter((item) => item.correct).length;
      const dayKey = new Date(session.createdAt).toISOString().slice(0, 10);
      const day = dailyMap.get(dayKey) || {
        dateKey: dayKey,
        sessions: 0,
        totalExercises: 0,
        correctAnswers: 0,
        accuracy: 0,
        totalPracticeTime: 0,
      };

      totalExercises += sessionTotal;
      correctAnswers += sessionCorrect;
      totalPracticeTime += session.totalTime || 0;
      day.sessions += 1;
      day.totalExercises += sessionTotal;
      day.correctAnswers += sessionCorrect;
      day.totalPracticeTime += session.totalTime || 0;
      day.accuracy = getAccuracy(day.correctAnswers, day.totalExercises);
      dailyMap.set(dayKey, day);

      session.emotions.forEach((emotion) => countEmotion(emotionCount, emotion));
    });

    const totalEmotionSamples = Object.values(emotionCount).reduce((sum, count) => sum + count, 0);
    const emotionMetrics = buildEmotionMetrics(emotionCount, totalEmotionSamples);
    const alerts = buildAlerts(emotionMetrics);
    const accuracy = getAccuracy(correctAnswers, totalExercises);
    const dominantEmotion = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
    const recommendations = buildRecommendations({
      accuracy,
      dominantEmotion,
      totalSessions: sessions.length,
      recentAccuracy: accuracy,
      overallAccuracy: accuracy,
    });
    const dailyStats = Array.from(dailyMap.values()).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
    const digestSummary = `${sessions.length} sessions this week, ${accuracy}% accuracy, dominant emotion ${dominantEmotion}.`;

    await createDigestNotification({
      userId: req.user._id,
      childId,
      alerts,
      summary: digestSummary,
    });

    const digestLines = [
      `Weekly Digest${childName ? ` for ${childName}` : ""}`,
      "",
      `Date Range: ${start.toISOString().slice(0, 10)} to ${end.toISOString().slice(0, 10)}`,
      `Sessions: ${sessions.length}`,
      `Practice Time: ${formatMinutes(totalPracticeTime)}`,
      `Accuracy: ${accuracy}% (${correctAnswers}/${totalExercises})`,
      `Dominant Emotion: ${dominantEmotion}`,
      "",
      "Daily Trend",
      ...dailyStats.map((item) => `- ${item.dateKey}: ${item.sessions} sessions, ${item.accuracy}% accuracy`),
      "",
      "Recommendations",
      ...recommendations.map((item) => `- ${item}`),
      "",
      "Alerts",
      ...(alerts.length ? alerts.map((item) => `- ${item}`) : ["- No critical weekly alerts."]),
    ];

    res.json({
      digest: digestLines.join("\n"),
      metrics: {
        sessions: sessions.length,
        accuracy,
        totalPracticeTime,
        dominantEmotion,
        emotionBreakdown: emotionMetrics,
        dailyStats,
        alerts,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
