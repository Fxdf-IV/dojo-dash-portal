import mongoose, { Schema, Document } from 'mongoose';

export interface ISensei extends Document {
  name: string;
  rank: string;
  description?: string;
  imageUrl?: string;
  orderIndex: number;
}

const SenseiSchema = new Schema<ISensei>({
  name: { type: String, required: true },
  rank: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  orderIndex: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<ISensei>('Sensei', SenseiSchema);
