//const userSchema = new mongoose.Schema({
//  firebaseUid: { type: String, required: true, unique: true },
//  username: { type: String, required: true },
//  email: { type: String, required: true, unique: true },
//  brawlstarsId: { type: String },
//  profilePic: { type: String, default: "default-profile-pic.png" },
//  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//  role: { type: String, enum: ["user", "admin", "banned"], default: "user" },
//}, { timestamps: true });

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const User = mongoose.model("User", userSchema);

export default User;
