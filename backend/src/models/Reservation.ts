import { Document, Schema, model } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields } from './plugins/softDelete';

export interface IReservation extends Document, SoftDeleteFields {
  customer: Schema.Types.ObjectId;
  animal: Schema.Types.ObjectId;
  order?: Schema.Types.ObjectId;
  depositAmount: number;
  expiresAt: Date;
  status: 'active' | 'expired' | 'converted' | 'cancelled';
}

const reservationSchema = new Schema<IReservation>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    animal: { type: Schema.Types.ObjectId, ref: 'Animal', required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    depositAmount: { type: Number, required: true, min: 0 },
    expiresAt: { type: Date, required: true, index: true },
    status: { type: String, enum: ['active', 'expired', 'converted', 'cancelled'], default: 'active', index: true }
  },
  { timestamps: true }
);

reservationSchema.plugin(softDeletePlugin);
reservationSchema.index({ customer: 1, animal: 1, status: 1, isDeleted: 1 });

export const Reservation = model<IReservation>('Reservation', reservationSchema);
