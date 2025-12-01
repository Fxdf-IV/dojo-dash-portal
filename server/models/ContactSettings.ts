import mongoose, { Schema, Document } from 'mongoose';

export interface IContactSettings extends Document {
  whatsappNumber: string;
  whatsappMessage: string;
}

const ContactSettingsSchema = new Schema<IContactSettings>({
  whatsappNumber: { type: String, required: true, default: '18987654321' },
  whatsappMessage: { type: String, required: true, default: 'Olá, gostaria de conhecer o karatê do Dojo Dash. Como eu posso começar?' },
}, { timestamps: true });

export default mongoose.models.ContactSettings || mongoose.model<IContactSettings>('ContactSettings', ContactSettingsSchema);
