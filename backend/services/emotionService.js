export const inferEmotion = ({ wrongAnswers, correctStreak, inactivity }) => {
  if (wrongAnswers > 3) return "frustrated";
  if (correctStreak > 5) return "happy";
  if (inactivity > 60) return "sad";
  return "neutral";
};