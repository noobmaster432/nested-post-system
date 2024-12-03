// path = api/post

import connectDB from "@/app/config/db";
import commentModel from "@/app/model/commentModel";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("POST");

      const { parentId, title } = req.body;

      if (!title || !parentId) {
        res
          .status(400)
          .json({ error: true, message: "Invalid data", data: [] });
      }

      await connectDB();

      const post = new commentModel({
        title,
        parentId,
      });

      const data = await post.save();

      res.status(200).json({ success: true, message: "comment created", data });
    } catch (err) {
      console.log(err);
    }
  }
}
