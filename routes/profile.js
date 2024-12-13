import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { authenticate } from "../permissions/authenticate.js";


const router = express.Router();
router.use(authenticate);


router.get("/profile", async (req, res) => {
  const userId = req.userId;

  try {
    const profile = await Profile.findOne({ user: userId }).populate("user", "email role");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.put("/profile", async (req, res) => {
  const userId = req.userId;
  const { username, brawlstarsId, profilePic } = req.body;

  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { username, brawlstarsId, profilePic },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});


router.get("/", async (req, res) => {
  const userId = req.userId; 

  try {
    const user = await User.findById(userId)
      .populate("followers", "username profilePic")
      .populate("following", "username profilePic");

    const posts = await Post.find({ author: userId }).populate("comments");
    const recentGames = []; 

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


router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .populate("followers", "username profilePic")
      .populate("following", "username profilePic");

    const posts = await Post.find({ author: id }).populate("comments");
    const recentGames = []; 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
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


router.put("/", async (req, res) => {
  const userId = req.userId; 
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