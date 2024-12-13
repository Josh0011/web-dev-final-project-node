import mongoose from "mongoose";

const moderatorPermsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User with moderator permissions
  canEditPosts: { type: Boolean, default: true }, // CRUD posts
  canBanUsers: { type: Boolean, default: true }, // Ban users
  canEdit: { type: Boolean, default: true }, // General editing permissions
}, { timestamps: true });

const ModeratorPerms = mongoose.model("ModeratorPerms", moderatorPermsSchema);

export default ModeratorPerms;
