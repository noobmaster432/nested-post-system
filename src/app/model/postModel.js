import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    
    updateScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

mongoose.models = {};

export default mongoose.model("Post", postSchema);
