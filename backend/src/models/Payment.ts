import { Document, Schema, model } from 'mongoose';
import { PaymentProvider, PaymentStatus } from '../constants/enums';
import { softDeletePlugin, SoftDeleteFields } from './plugins/softDelete';

export interface IPayment extends Document, SoftDeleteFields {
  order: Schema.Types.ObjectId;
  customer?: Schema.Types.ObjectId;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: 'NGN';
  reference: string;
  providerReference?: string;
  authorizationUrl?: string;
  paidAt?: Date;
  metadata?: Record<string, unknown>;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    provider: { type: String, enum: Object.values(PaymentProvider), required: true, index: true },
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.Pending, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['NGN'], default: 'NGN' },
    reference: { type: String, required: true, unique: true, index: true },
    providerReference: String,
    authorizationUrl: String,
    paidAt: Date,
    metadata: Schema.Types.Mixed
  },
  { timestamps: true }
);

paymentSchema.plugin(softDeletePlugin);

export const Payment = model<IPayment>('Payment', paymentSchema);
