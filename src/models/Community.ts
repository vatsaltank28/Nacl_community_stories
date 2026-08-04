import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export const Community = mongoose.models.Community || mongoose.model("Community", CommunitySchema);
