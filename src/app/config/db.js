import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const URI = process.env.URI;


    if (mongoose.connections[0].readyState) {
      console.log("Already connected");
      return;
    } else {
      await mongoose.connect(URI);
      console.log("DB connected");
    }
  } catch (error) {
    console.log(error);
  }
}
