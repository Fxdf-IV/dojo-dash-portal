import mongoose, { Schema, Document } from 'mongoose';

export interface ILocationImage {
  imageUrl: string;
  caption?: string;
}

export interface ILocation extends Document {
  name: string;
  description?: string;
  imageUrl?: string;
  images: ILocationImage[];
  orderIndex?: number;
}

const LocationImageSchema = new Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String },
}, { _id: false });

const LocationSchema = new Schema<ILocation>({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  images: [LocationImageSchema],
  orderIndex: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<ILocation>('Location', LocationSchema);
