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

export default router;
