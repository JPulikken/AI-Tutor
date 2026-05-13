import { inferEmotion } from "../services/emotionService.js";

export const updateEmotion = (req, res) => {
  const { emotion, wrongAnswers, correctStreak, inactivity } = req.body;

  let finalEmotion = emotion;

  if (!emotion) {
    finalEmotion = inferEmotion({ wrongAnswers, correctStreak, inactivity });
  }

  res.json({ emotion: finalEmotion });
};