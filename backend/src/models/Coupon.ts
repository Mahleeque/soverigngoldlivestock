import { Document, Schema, model } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields } from './plugins/softDelete';

export interface ICoupon extends Document, SoftDeleteFields {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startsAt: Date;
  expiresAt: Date;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0, min: 0 },
    maxDiscountAmount: { type: Number, min: 0 },
    startsAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true, index: true },
    usageLimit: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

couponSchema.plugin(softDeletePlugin);

export const Coupon = model<ICoupon>('Coupon', couponSchema);
