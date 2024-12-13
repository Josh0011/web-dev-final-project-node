import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  images: { type: [String], required: true }, // Array of image URLs
  title: { type: String, required: true },
  description: { type: String, required: true },
  postId: { type: String, unique: true, required: true },
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;
