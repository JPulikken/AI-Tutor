import test from "node:test";
import assert from "node:assert/strict";
import { buildAdaptiveQuiz, curatedVideos, getRecommendedVideo, getTopicQuestions } from "./learningEngine.js";

test("getTopicQuestions returns more questions as level increases", () => {
  assert.equal(getTopicQuestions("colors-1", "easy").length, 3);
  assert.equal(getTopicQuestions("colors-1", "medium").length, 4);
  assert.equal(getTopicQuestions("colors-1", "hard").length, 5);
});

test("buildAdaptiveQuiz simplifies easy options", () => {
  const quiz = buildAdaptiveQuiz({ id: "numbers-1" }, "easy");

  assert.equal(quiz[0].options.length, 2);
  assert.ok(quiz[0].options.includes(quiz[0].answer));
  assert.equal(quiz[0].hint, "Take your time and try elimination.");
});

test("buildAdaptiveQuiz adds challenge option on hard level", () => {
  const quiz = buildAdaptiveQuiz({ id: "numbers-1" }, "hard");

  assert.equal(quiz.length, 5);
  assert.ok(quiz[0].options.includes("5"));
  assert.equal(quiz[0].hint, "Try answering before using hints.");
});

test("every curated video has a review status and URL", () => {
  Object.values(curatedVideos).forEach((video) => {
    assert.match(video.url, /^https:\/\/www\.youtube\.com\//);
    assert.equal(video.reviewStatus, "Caregiver review recommended");
  });
});

test("getRecommendedVideo returns null for unknown lessons", () => {
  assert.equal(getRecommendedVideo("missing-lesson"), null);
});
