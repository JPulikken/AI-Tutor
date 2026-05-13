export const emotionMeta = {
  neutral: { label: "Neutral", emoji: "😐" },
  happy: { label: "Happy", emoji: "😊" },
  sad: { label: "Sad", emoji: "😢" },
  unhappy: { label: "Unhappy", emoji: "😞" },
  frustrated: { label: "Frustrated", emoji: "😣" },
  excited: { label: "Excited", emoji: "🤩" },
  curious: { label: "Curious", emoji: "🧐" },
  sleepy: { label: "Sleepy", emoji: "😴" },
  surprised: { label: "Surprised", emoji: "😮" },
};

export const negativeEmotions = new Set(["sad", "unhappy", "frustrated", "sleepy"]);

export const mapExpressionsToEmotion = (expressions = {}) => {
  const happy = expressions.happy || 0;
  const sad = expressions.sad || 0;
  const angry = expressions.angry || 0;
  const disgusted = expressions.disgusted || 0;
  const surprised = expressions.surprised || 0;
  const neutral = expressions.neutral || 0;

  if (angry > 0.28 || disgusted > 0.24) return "frustrated";
  if ((happy > 0.42 && surprised > 0.2) || happy > 0.6) return "excited";
  if (sad > 0.34) return "sad";
  if ((surprised > 0.35 && neutral > 0.28) || surprised > 0.45) return "curious";
  if (neutral > 0.75 && happy < 0.12 && surprised < 0.12) return "sleepy";
  if (happy > 0.3) return "happy";
  return "neutral";
};
