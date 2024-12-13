import express from "express";
import User from "../models/User.js";
import { requireAdmin } from "../permissions/role.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firebaseUid, email, role } = req.body;

  console.log("Received registration request:", { firebaseUid, email, role });

  try {
    if (!firebaseUid || !email || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ firebaseUid, email, role });
    const savedUser = await newUser.save();

    console.log("User registered in MongoDB:", savedUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
  
    if (error.code === 11000) {
      console.error("Duplicate key error:", error.keyValue);
      res.status(400).json({ message: "Duplicate field: " + JSON.stringify(error.keyValue) });
    } else {
      console.error("Error registering user in MongoDB:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});



import { authenticate } from "../permissions/authenticate.js";
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
