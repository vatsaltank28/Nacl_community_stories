import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  role: { type: String, enum: ["user", "admin", "host"], default: "user" },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
