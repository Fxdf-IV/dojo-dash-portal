import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  imageUrl?: string;
  registrationPrice?: number;
  registeredStudents: mongoose.Types.ObjectId[];
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  imageUrl: { type: String },
  registrationPrice: { type: Number, min: 0 },
  registeredStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IEvent>('Event', EventSchema);

