// path = api/post

import connectDB from "@/app/config/db";
import postModel from "@/app/model/postModel";
import commentModel from "@/app/model/commentModel";
import { comment } from "postcss";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("POST");

    const { title } = req.body;

    if (!title) {
      res
        .status(400)
        .json({ error: true, message: "title is required", data: [] });
    }

    await connectDB();

    const post = new postModel({
      title,
      // updateScore: 1,
    });

    const data = await post.save();

    res.status(200).json({ success: true, message: "Post created", data });
  } else if (req.method === "GET") {
    await connectDB();

    const posts = await postModel.find({});
    const comments = await commentModel.find({});

    // Recursive function to build the nested comment structure
    const buildCommentTree = (parentId) => {
      return comments
        .filter((comment) => comment.parentId === parentId)
        .map((comment) => ({
          ...comment._doc,
          subComments: buildCommentTree(comment._id.toString()),
        }));
    };

    const postWithComments = posts.map((post) => {
      const postComments = buildCommentTree(post._id.toString());
      return {
        ...post._doc,
        comments: postComments,
      };
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Posts fetched",
        data: postWithComments,
      });
  } else if (req.method === "PUT") {
    try {
      console.log("PUT");

      const { id, title } = req.body;

      if (!id || !title) {
        res
          .status(400)
          .json({ error: true, message: "id and title is required", data: [] });
      }

      await connectDB();

      const data = await postModel.find({ _id: id });

      if (!data) {
        res
          .status(404)
          .json({ error: true, message: "id is invalid", data: [] });
      }

      const updatedScore = data.updateScore + 1;

      const updatedData = await postModel.findByIdAndUpdate(
        { _id: id },
        { title, updatedScore: updatedScore },
        { new: true }
      );

      res
        .status(200)
        .json({ success: true, message: "Post updated", data: updatedData });
    } catch (error) {
      console.log(error);

      res
        .status(500)
        .json({ error: true, message: "Internal server error", data: [] });
    }
  }
}
