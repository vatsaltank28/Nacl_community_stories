import mongoose, { Schema, Document } from "mongoose";

export interface IStory extends Document {
  customerName: string;
  eventId: string;
  eventTitle: string;
  experience: string;
  photo: string;
  date: string;
  createdAt: Date;
}

const StorySchema: Schema = new Schema({
  customerName: { type: String, required: true },
  eventId: { type: String, required: true },
  eventTitle: { type: String, required: true },
  experience: { type: String, required: true },
  photo: { type: String, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Story || mongoose.model<IStory>("Story", StorySchema);
