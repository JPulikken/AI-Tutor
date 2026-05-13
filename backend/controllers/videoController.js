import Video from "../models/Video.js";

export const getVideos = async (req, res) => {
  const { topic, level } = req.query;

  try {
    const videos = await Video.find({ topic, level });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};