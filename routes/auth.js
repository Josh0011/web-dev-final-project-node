import express from "express";
import admin from "../firebaseConfig.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { token } = req.body;

  console.log("Login request received:", token); 

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    console.log("Decoded token UID:", uid);

    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user); 

    res.status(200).json(user);
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
});


export default router;
