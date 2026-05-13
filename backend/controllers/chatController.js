import ChatMemory from "../models/ChatMemory.js";
import Progress from "../models/Progress.js";
import Session from "../models/Session.js";
import { getAccuracy, getBestLearningHour } from "../services/progressInsights.js";

const lessonNames = {
  "colors-1": "colors",
  "numbers-1": "numbers",
  "letters-1": "letters",
  "shapes-1": "shapes",
  "basics-1": "emotions",
  "social-1": "social skills",
};

const topicKeywords = {
  colors: ["color", "colors", "red", "blue", "green", "yellow"],
  numbers: ["number", "numbers", "count", "counting", "math"],
  shapes: ["shape", "shapes", "circle", "square", "triangle"],
  letters: ["letter", "letters", "word", "alphabet", "abc"],
  emotions: ["emotion", "emotions", "mood", "feel", "feeling", "sad", "happy", "frustrated", "calm"],
  social: ["social", "hello", "please", "thank you", "friend"],
};

const normalizeHistory = (history = []) =>
  Array.isArray(history)
    ? history
      .filter((item) => item && typeof item.text === "string")
      .map((item) => ({
        role: item.role === "assistant" ? "assistant" : "user",
        text: item.text.trim(),
      }))
      .filter((item) => item.text)
    : [];

const detectTopic = (text = "") => {
  const value = text.toLowerCase();

  return Object.entries(topicKeywords).find(([, keywords]) =>
    keywords.some((keyword) => value.includes(keyword))
  )?.[0] || "";
};

const getLastUserTopic = (history = []) => {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    const item = history[index];
    if (item.role !== "user") continue;
    const topic = detectTopic(item.text);
    if (topic) return topic;
  }
  return "";
};

const isFollowUp = (text = "") => {
  const value = text.toLowerCase();
  return ["more", "again", "that", "it", "next one", "easier", "harder", "why", "how", "explain"].some((token) =>
    value.includes(token)
  );
};

const getTopicLesson = (topic) => {
  const lessons = {
    colors: "Try a color hunt: find one red, one blue, and one green thing near you.",
    numbers: "Count with movement: clap five times and say each number aloud.",
    shapes: "Find one circle, one square, and one triangle in the room.",
    letters: "Pick one letter and say a word that starts with it.",
    emotions: "Name the feeling, take three deep breaths, then answer one easy question.",
    social: "Practice saying: hello, please, and thank you with eye contact.",
  };

  return lessons[topic] || "Take one small step, then build from that win.";
};

const getDominantEmotionFromSessions = (sessions = []) => {
  const counts = {};
  sessions.forEach((session) => {
    session.emotions.forEach((emotion) => {
      counts[emotion] = (counts[emotion] || 0) + 1;
    });
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
};

const buildSnapshot = (progress, sessions = [], childId = "") => {
  if (sessions.length) {
    let total = 0;
    let correct = 0;

    sessions.forEach((session) => {
      total += session.stats?.totalExercises ?? session.exercises.length;
      correct += session.stats?.correctAnswers ?? session.exercises.filter((exercise) => exercise.correct).length;
    });

    return {
      sessions: sessions.length,
      totalExercises: total,
      correctAnswers: correct,
      accuracy: getAccuracy(correct, total),
      dominantEmotion: getDominantEmotionFromSessions(sessions),
      bestHour: null,
    };
  }

  const analytics = progress.analytics || {};
  const childStat = childId
    ? (analytics.childStats || []).find((item) => item.childId === childId)
    : null;
  const base = childStat || analytics;

  return {
    sessions: base?.sessions || analytics.totalSessions || 0,
    totalExercises: base?.totalExercises || analytics.totalExercises || 0,
    correctAnswers: base?.correctAnswers || analytics.correctAnswers || 0,
    accuracy: base?.accuracy || analytics.accuracy || 0,
    dominantEmotion: childStat?.dominantEmotion || getDominantEmotionFromSessions([]),
    bestHour: getBestLearningHour(analytics.hourlySessions),
  };
};

const extractGoalCandidate = (message = "") => {
  const text = message.trim();
  const lower = text.toLowerCase();
  const markers = ["goal:", "i want to learn", "help me learn", "my goal is"];
  const marker = markers.find((item) => lower.includes(item));
  if (!marker) return "";

  if (marker === "goal:") {
    return text.split(/goal:/i)[1]?.trim() || "";
  }

  return text.slice(lower.indexOf(marker) + marker.length).trim();
};

const upsertArray = (current = [], value = "", limit = 6) => {
  if (!value) return current;
  const normalized = value.trim();
  if (!normalized) return current;
  const existing = current.filter((item) => item.toLowerCase() !== normalized.toLowerCase());
  return [normalized, ...existing].slice(0, limit);
};

const getMemoryPrompt = (memory) => {
  const goals = memory?.goals?.length ? `Goals: ${memory.goals.join(", ")}.` : "";
  const strengths = memory?.strengths?.length ? `Strengths: ${memory.strengths.join(", ")}.` : "";
  const focus = memory?.focusAreas?.length ? `Focus areas: ${memory.focusAreas.join(", ")}.` : "";
  return [goals, strengths, focus].filter(Boolean).join(" ");
};

const buildReply = ({ message, history, progress, snapshot, childName, memory }) => {
  const text = message.toLowerCase();
  const completed = progress.completedLessons || [];
  const completedNames = completed.map((lessonId) => lessonNames[lessonId] || lessonId);
  const topic = detectTopic(text) || (isFollowUp(text) ? getLastUserTopic(history) : "");
  const childLabel = childName ? ` for ${childName}` : "";
  const memoryPrompt = getMemoryPrompt(memory);

  if (text.includes("progress") || text.includes("report") || text.includes("stats")) {
    const bestHourText = snapshot.bestHour?.sessions
      ? ` Best learning hour: ${String(snapshot.bestHour.hour).padStart(2, "0")}:00.`
      : "";
    return `Here is the latest learning summary${childLabel}: ${snapshot.sessions} sessions, ${snapshot.accuracy}% quiz accuracy (${snapshot.correctAnswers}/${snapshot.totalExercises}), ${progress.totalStars} stars, and a ${progress.currentStreak || 0}-day streak. Most frequent emotion: ${snapshot.dominantEmotion}.${bestHourText}`;
  }

  if (text.includes("mood") || text.includes("emotion") || text.includes("feel")) {
    return `Recent emotional trend${childLabel}: ${snapshot.dominantEmotion}. If stress appears, switch to one fun activity, one easier question, then praise effort. ${memoryPrompt}`.trim();
  }

  if (text.includes("next") || text.includes("lesson")) {
    const learned = completedNames.length ? `Completed topics include ${completedNames.join(", ")}.` : "The learner is just starting.";
    const nextTopic = topic || (snapshot.accuracy < 65 ? "colors" : "numbers");
    return `${learned} Suggested next step${childLabel}: ${nextTopic}. ${getTopicLesson(nextTopic)}`;
  }

  if (topic) {
    const prefix = isFollowUp(text) ? "Great follow-up. " : "";
    return `${prefix}${getTopicLesson(topic)} ${memoryPrompt}`.trim();
  }

  if (text.includes("hard") || text.includes("difficult") || text.includes("stuck")) {
    return "You are learning, not failing. Try one easy step, one hint, then one retry. We can reduce difficulty anytime.";
  }

  return `I can use recent chat context and saved progress${childLabel}. Ask for lesson guidance, mood support, report insights, or weekly digest help.`;
};

const loadMemory = async (userId, childId) => {
  if (!childId) return null;

  return (await ChatMemory.findOne({ userId, childId })) || (await ChatMemory.create({ userId, childId }));
};

const updateMemory = async ({ memory, message, reply, topic, snapshot }) => {
  if (!memory) return null;

  const goalCandidate = extractGoalCandidate(message);
  if (goalCandidate) {
    memory.goals = upsertArray(memory.goals, goalCandidate, 6);
  }

  if (topic) {
    memory.topicCounts.set(topic, (memory.topicCounts.get(topic) || 0) + 1);
  }

  if (snapshot.accuracy >= 75 && topic) {
    memory.strengths = upsertArray(memory.strengths, topic, 5);
  }

  if (snapshot.accuracy < 60 && topic) {
    memory.focusAreas = upsertArray(memory.focusAreas, topic, 5);
  }

  memory.recentTurns = [...(memory.recentTurns || []), { role: "user", text: message }, { role: "assistant", text: reply }]
    .slice(-20);
  memory.summary = `Last known accuracy ${snapshot.accuracy}%. Dominant emotion ${snapshot.dominantEmotion}.`;
  await memory.save();
  return memory;
};

export const chatWithTutor = async (req, res) => {
  try {
    const { message, context = {} } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (String(message).length > 600) {
      return res.status(400).json({ error: "Message is too long. Please keep it under 600 characters." });
    }

    const childId = typeof context.childId === "string" ? context.childId : "";
    const childName = typeof context.childName === "string" ? context.childName : "";
    const history = normalizeHistory(context.history || []).slice(-16);
    const text = message.trim();
    const topic = detectTopic(text) || (isFollowUp(text) ? getLastUserTopic(history) : "");

    const progress =
      (await Progress.findOne({ userId: req.user._id })) || { completedLessons: [], totalStars: 0, currentStreak: 0, analytics: {} };
    const sessionQuery = childId ? { userId: req.user._id, childId } : { userId: req.user._id };
    const sessions = await Session.find(sessionQuery).sort({ createdAt: -1 }).limit(12);
    const snapshot = buildSnapshot(progress, sessions, childId);
    const memory = await loadMemory(req.user._id, childId);

    const reply = buildReply({
      message: text,
      history,
      progress,
      snapshot,
      childName,
      memory,
    });

    const updatedMemory = await updateMemory({
      memory,
      message: text,
      reply,
      topic,
      snapshot,
    });

    res.json({
      reply,
      context: {
        childId: childId || null,
        sessionsUsed: snapshot.sessions,
        dominantEmotion: snapshot.dominantEmotion,
        accuracy: snapshot.accuracy,
        memory: updatedMemory
          ? {
            goals: updatedMemory.goals || [],
            strengths: updatedMemory.strengths || [],
            focusAreas: updatedMemory.focusAreas || [],
            summary: updatedMemory.summary || "",
          }
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
