import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  type: String,
  difficulty: Number,
  emotionTag: [String],
  content: String,
});

export default mongoose.model("Exercise", exerciseSchema);