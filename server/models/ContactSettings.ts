import mongoose, { Schema, Document } from 'mongoose';

export interface IContactSettings extends Document {
  whatsappNumber: string;
  whatsappMessage: string;
}

const ContactSettingsSchema = new Schema<IContactSettings>({
  whatsappNumber: { type: String, required: true, default: '18997558617' },
  whatsappMessage: { type: String, required: true, default: 'Olá, gostaria de conhecer o karatê do Alessandro Dojo. Como eu posso começar?' },
}, { timestamps: true });

export default mongoose.model<IContactSettings>('ContactSettings', ContactSettingsSchema);
