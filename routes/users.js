import express from "express";
import User from "../models/User.js";
import { authenticate } from "../permissions/authenticate.js";
import { requireAdmin } from "../permissions/role.js";

const router = express.Router();
router.use(authenticate);

router.get("/", requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/ban/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "banned";
    await user.save();

    res.status(200).json({ message: "User banned successfully" });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/follow/:id", async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    const user = await User.findById(userId);
    const userToFollow = await User.findById(id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    if (!user.following.includes(id)) {
      user.following.push(id);
      userToFollow.followers.push(userId);
      await user.save();
      await userToFollow.save();
    }

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/unfollow/:id", async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User to unfollow not found" });
    }

    user.following = user.following.filter((followId) => followId.toString() !== id);
    userToUnfollow.followers = userToUnfollow.followers.filter((followerId) => followerId.toString() !== userId);

    await user.save();
    await userToUnfollow.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
