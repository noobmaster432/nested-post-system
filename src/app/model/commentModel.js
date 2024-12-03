import mongoose from "mongoose";

const comment = new mongoose.Schema(
  {
    parentId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.models = {};

export default mongoose.model("Comment", comment);
