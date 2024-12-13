import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { authenticate } from "../middle/authenticate.js";


const router = express.Router();
router.use(authenticate);

// Get Current User's Profile
router.get("/", async (req, res) => {
  const userId = req.userId; // Assume middleware sets userId from authentication token

  try {
    const user = await User.findById(userId)
      .populate("followers", "username profilePic")
      .populate("following", "username profilePic");

    const posts = await Post.find({ author: userId }).populate("comments");
    const recentGames = []; // Populate this if games data is added to DB

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user,
      posts,
      recentGames,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Another User's Profile by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .populate("followers", "username profilePic")
      .populate("following", "username profilePic");

    const posts = await Post.find({ author: id }).populate("comments");
    const recentGames = []; // Populate if games data is added to DB

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hide sensitive information
    const { email, brawlstarsId, ...safeUserData } = user.toObject();

    res.status(200).json({
      user: safeUserData,
      posts,
      recentGames,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Current User's Profile
router.put("/", async (req, res) => {
  const userId = req.userId; // Assume middleware sets userId from authentication token
  const { username, email, brawlstarsId } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, brawlstarsId },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;