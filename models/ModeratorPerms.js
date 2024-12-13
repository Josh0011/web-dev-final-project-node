import mongoose from "mongoose";

const moderatorPermsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  canEditPosts: { type: Boolean, default: true }, 
  canBanUsers: { type: Boolean, default: true },
  canEdit: { type: Boolean, default: true }, 
}, { timestamps: true });

const ModeratorPerms = mongoose.model("ModeratorPerms", moderatorPermsSchema);

export default ModeratorPerms;
