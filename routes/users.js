import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firebaseUid, email, role } = req.body;

  console.log("Received registration request:", { firebaseUid, email, role }); // Debug log

  try {
    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      console.log("User already exists:", existingUser); // Debug log
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ firebaseUid, email, role });
    const savedUser = await newUser.save();

    console.log("User registered in MongoDB:", savedUser); // Debug log

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user in MongoDB:", error); // Debug log
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
