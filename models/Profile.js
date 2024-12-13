import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    username: { type: String, required: true },
    brawlstarsId: { type: String },
    profilePic: { type: String, default: "default-profile-pic.png" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;