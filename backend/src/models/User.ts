import bcrypt from 'bcrypt';
import { Document, Schema, model } from 'mongoose';
import validator from 'validator';
import { env } from '../config/env';
import { UserRole } from '../constants/enums';
import { softDeletePlugin, SoftDeleteFields } from './plugins/softDelete';

export interface IUser extends Document, SoftDeleteFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  avatarUrl?: string;
  emailVerified: boolean;
  isBlocked: boolean;
  blockedAt?: Date | null;
  lastLoginAt?: Date | null;
  tokenVersion: number;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  addresses: {
    label: string;
    addressLine: string;
    city: string;
    state: string;
    phone?: string;
    isDefault: boolean;
  }[];
  wishlist: Schema.Types.ObjectId[];
  notificationSettings: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Invalid email address']
    },
    phone: { type: String, required: true, unique: true, trim: true, minlength: 7, maxlength: 20 },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.Customer, index: true },
    avatarUrl: String,
    emailVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false, index: true },
    blockedAt: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
    tokenVersion: { type: Number, default: 0 },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    addresses: [
      {
        label: { type: String, required: true, trim: true },
        addressLine: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        phone: { type: String, trim: true },
        isDefault: { type: Boolean, default: false }
      }
    ],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Animal' }],
    notificationSettings: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

userSchema.plugin(softDeletePlugin);
userSchema.index({ email: 1, isDeleted: 1 });
userSchema.index({ phone: 1, isDeleted: 1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, env.bcryptSaltRounds);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>('User', userSchema);
