import { Document, Schema, model } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields } from './plugins/softDelete';

export interface IWhatsAppOrder extends Document, SoftDeleteFields {
  phone: string;
  customer?: Schema.Types.ObjectId;
  order?: Schema.Types.ObjectId;
  conversationId: string;
  status: 'open' | 'awaiting_payment' | 'converted' | 'closed';
  messages: { direction: 'incoming' | 'outgoing'; body: string; sentAt: Date; metadata?: Record<string, unknown> }[];
}

const whatsappOrderSchema = new Schema<IWhatsAppOrder>(
  {
    phone: { type: String, required: true, trim: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User' },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    conversationId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['open', 'awaiting_payment', 'converted', 'closed'], default: 'open', index: true },
    messages: [
      {
        direction: { type: String, enum: ['incoming', 'outgoing'], required: true },
        body: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        metadata: Schema.Types.Mixed
      }
    ]
  },
  { timestamps: true }
);

whatsappOrderSchema.plugin(softDeletePlugin);

export const WhatsAppOrder = model<IWhatsAppOrder>('WhatsAppOrder', whatsappOrderSchema);
