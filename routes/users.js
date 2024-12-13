import express from "express";
import User from "../models/User.js";
import { requireAdmin } from "../permissions/role.js";

const router = express.Router();

import Profile from "../models/Profile.js";

router.post("/register", async (req, res) => {
  const { firebaseUid, email, role } = req.body;

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

    
    const newProfile = new Profile({
      user: savedUser._id,
      username: email.split("@")[0], 
    });
    await newProfile.save();

    res.status(201).json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Duplicate field", error: error.keyValue });
    } else {
      res.status(500).json({ message: "Internal server error", error });
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
  const { id: followId } = req.params;

  try {
    const [profile, profileToFollow] = await Promise.all([
      Profile.findOne({ user: userId }),
      Profile.findOne({ user: followId }),
    ]);

    if (!profile || !profileToFollow) {
      return res.status(404).json({ message: "User profile not found" });
    }

    if (!profile.following.includes(followId)) {
      profile.following.push(followId);
      profileToFollow.followers.push(userId);

      await Promise.all([profile.save(), profileToFollow.save()]);
    }

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.post("/unfollow/:id", async (req, res) => {
  const userId = req.userId;
  const { id: unfollowId } = req.params;

  try {
    const [profile, profileToUnfollow] = await Promise.all([
      Profile.findOne({ user: userId }),
      Profile.findOne({ user: unfollowId }),
    ]);

    if (!profile || !profileToUnfollow) {
      return res.status(404).json({ message: "User profile not found" });
    }

    profile.following = profile.following.filter((id) => id.toString() !== unfollowId);
    profileToUnfollow.followers = profileToUnfollow.followers.filter((id) => id.toString() !== userId);

    await Promise.all([profile.save(), profileToUnfollow.save()]);

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});



export default router;
