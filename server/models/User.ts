import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name?: string;
  email?: string;
  username?: string;
  password: string;
  role: 'admin' | 'student';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, lowercase: true },
  username: { type: String, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
}, { timestamps: true });

// Validar que pelo menos um dos dois (email ou username) existe
UserSchema.pre('validate', function(next) {
  if (!this.email && !this.username) {
    next(new Error('Usuário deve ter email ou nome de usuário'));
  } else {
    next();
  }
});

// Hash password antes de salvar
UserSchema.pre('save', async function(next) {
  const user = this as any as IUser;
  if (!user.isModified('password')) return next();
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

// Método para comparar senha
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  const user = this as any as IUser;
  return bcrypt.compare(candidatePassword, user.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
