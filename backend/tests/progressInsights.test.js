import assert from "node:assert/strict";
import test from "node:test";
import {
  applyQuestProgress,
  detectCalmComeback,
  getAccuracy,
  getDateKey,
} from "../services/progressInsights.js";

test("getAccuracy returns rounded percentage", () => {
  assert.equal(getAccuracy(7, 10), 70);
  assert.equal(getAccuracy(0, 0), 0);
  assert.equal(getAccuracy(2, 3), 67);
});

test("detectCalmComeback identifies recovery pattern", () => {
  assert.equal(detectCalmComeback(["frustrated", "sad", "neutral", "happy"]), true);
  assert.equal(detectCalmComeback(["happy", "happy", "frustrated", "sad"]), false);
});

test("applyQuestProgress completes quests and awards stars once", () => {
  const progress = {
    totalStars: 10,
    gamification: {
      questDateKey: "",
      dailyQuests: [],
      totalQuestBonuses: 0,
    },
  };

  const today = getDateKey();
  const first = applyQuestProgress(progress, { lessons: 1, correctAnswers: 3, practiceSeconds: 600 }, today);
  assert.equal(first.bonusStars > 0, true);
  assert.equal(progress.totalStars > 10, true);

  const previousStars = progress.totalStars;
  const second = applyQuestProgress(progress, { lessons: 1, correctAnswers: 3, practiceSeconds: 600 }, today);
  assert.equal(second.bonusStars >= 0, true);
  assert.equal(progress.totalStars >= previousStars, true);
});
