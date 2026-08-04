import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["joined", "waitlist", "cancelled"], default: "joined" },
  qrCode: { type: String },
}, { timestamps: true });

export const Registration = mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);
