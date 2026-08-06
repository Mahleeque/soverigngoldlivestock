import { Document, Schema, model } from 'mongoose';
import { DeliveryStatus, OrderStatus, PaymentStatus } from '../constants/enums';
import { softDeletePlugin, SoftDeleteFields } from './plugins/softDelete';

export interface IOrder extends Document, SoftDeleteFields {
  orderNumber: string;
  customer?: Schema.Types.ObjectId;
  source: 'website' | 'whatsapp' | 'manual';
  items: {
    animal: Schema.Types.ObjectId;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  depositDue: number;
  balanceDue: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  deliveryAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
  };
  deliveryZone?: Schema.Types.ObjectId;
  deliveryDate?: Date;
  statusHistory: { status: OrderStatus; note?: string; changedBy?: Schema.Types.ObjectId; changedAt: Date }[];
  coupon?: Schema.Types.ObjectId;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    source: { type: String, enum: ['website', 'whatsapp', 'manual'], default: 'website', index: true },
    items: [
      {
        animal: { type: Schema.Types.ObjectId, ref: 'Animal', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        total: { type: Number, required: true, min: 0 }
      }
    ],
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    depositDue: { type: Number, default: 0, min: 0 },
    balanceDue: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.Pending, index: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.Pending, index: true },
    deliveryStatus: { type: String, enum: Object.values(DeliveryStatus), default: DeliveryStatus.Pending, index: true },
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true }
    },
    deliveryZone: { type: Schema.Types.ObjectId, ref: 'DeliveryZone' },
    deliveryDate: Date,
    statusHistory: [
      {
        status: { type: String, enum: Object.values(OrderStatus), required: true },
        note: String,
        changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now }
      }
    ],
    coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' }
  },
  { timestamps: true }
);

orderSchema.plugin(softDeletePlugin);
orderSchema.index({ customer: 1, status: 1, createdAt: -1, isDeleted: 1 });

export const Order = model<IOrder>('Order', orderSchema);
