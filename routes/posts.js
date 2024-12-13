import express from "express";
import Post from "../models/Post.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(authenticate);

// Create a post (accessible by all logged-in users)
router.post("/", async (req, res) => {
  const { title, body, image, tags } = req.body;

  try {
    const newPost = new Post({
      title,
      body,
      image,
      tags,
      author: req.userId,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a post (restricted to admins)
router.put("/:id", requireAdmin, async (req, res) => {
  const { title, body, image, tags } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, body, image, tags },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a post (restricted to admins)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
