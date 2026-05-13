import Exercise from "../models/Exercise.js";

export const getExercise = async (req, res) => {
  const { emotion, level } = req.query;

  try {
    const exercises = await Exercise.find({
      emotionTag: emotion,
      difficulty: level,
    });

    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};