import mongoose from "mongoose";

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Explorer, Creator, Mover, Connector
  icon: { type: String, required: true },
}, { timestamps: true });

export const Badge = mongoose.models.Badge || mongoose.model("Badge", BadgeSchema);
