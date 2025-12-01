import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  filename: string;
  mimetype: string;
  size: number;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>({
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true },
}, { timestamps: true });

export default mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);

