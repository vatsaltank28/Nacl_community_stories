import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  reviewerName: string;
  eventId: string;
  eventName: string;
  city: string;
  coordinates?: [number, number]; // [longitude, latitude] optional fallback
  rating: number;
  reviewText: string;
  eventImage?: string;
  status: "published" | "pending" | "hidden";
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  reviewerName: { type: String, required: true, trim: true },
  eventId: { type: String, required: true, index: true },
  eventName: { type: String, required: true },
  city: { type: String, required: true, index: true },
  coordinates: {
    type: [Number],
    required: false,
    default: undefined,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true, trim: true },
  eventImage: { type: String, default: "" },
  status: {
    type: String,
    enum: ["published", "pending", "hidden"],
    default: "published",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
