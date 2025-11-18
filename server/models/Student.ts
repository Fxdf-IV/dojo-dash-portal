import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  birthDate?: Date;
  phone?: string;
  startDate?: Date;
  beltId: string;
  location: string;
  status: 'active' | 'pending' | 'inactive';
}

const StudentSchema = new Schema<IStudent>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  birthDate: { type: Date },
  phone: { type: String },
  startDate: { type: Date },
  beltId: { type: String, required: true, default: 'white' },
  location: { type: String, required: true },
  status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<IStudent>('Student', StudentSchema);
