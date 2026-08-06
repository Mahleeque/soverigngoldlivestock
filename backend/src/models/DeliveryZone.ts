import { Document, Schema, model } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields } from './plugins/softDelete';

export interface IDeliveryZone extends Document, SoftDeleteFields {
  name: string;
  states: string[];
  baseFee: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  active: boolean;
}

const deliveryZoneSchema = new Schema<IDeliveryZone>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    states: [{ type: String, required: true, trim: true }],
    baseFee: { type: Number, required: true, min: 0 },
    estimatedDaysMin: { type: Number, required: true, min: 0 },
    estimatedDaysMax: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

deliveryZoneSchema.plugin(softDeletePlugin);
deliveryZoneSchema.index({ states: 1, active: 1, isDeleted: 1 });

export const DeliveryZone = model<IDeliveryZone>('DeliveryZone', deliveryZoneSchema);
