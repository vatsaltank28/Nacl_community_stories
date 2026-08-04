import mongoose from "mongoose";

const MiniGameSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  type: { type: String, required: true }, // e.g., CommunityMatch
  config: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export const MiniGame = mongoose.models.MiniGame || mongoose.model("MiniGame", MiniGameSchema);
