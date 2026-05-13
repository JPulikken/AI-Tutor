import mongoose from "mongoose";

const childSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 1,
      max: 18,
      default: 8,
    },
    avatar: {
      type: String,
      default: "😊",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Child", childSchema);
