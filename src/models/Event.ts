import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  maxSeats: { type: Number, required: true },
  remainingSeats: { type: Number, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

export const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
