import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  topic: String,
  url: String,
  level: Number,
});

export default mongoose.model("Video", videoSchema);