import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  title: string;
  type: 'kihon' | 'kata' | 'theory' | 'bunkai';
  description?: string;
  content?: string;
  videoUrl?: string;
  imageUrl?: string;
  minBeltId?: string; // Mudança: usar beltId em vez de minKyu
}

const MaterialSchema = new Schema<IMaterial>({
  title: { type: String, required: true },
  type: { type: String, enum: ['kihon', 'kata', 'theory', 'bunkai'], required: true },
  description: { type: String },
  content: { type: String },
  videoUrl: { type: String },
  imageUrl: { type: String },
  minBeltId: { type: String }, // Mudança: usar beltId em vez de minKyu
}, { timestamps: true });

export default mongoose.model<IMaterial>('Material', MaterialSchema);
