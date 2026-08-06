import { Document, Schema, model } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields } from './plugins/softDelete';

export interface INotification extends Document, SoftDeleteFields {
  user: Schema.Types.ObjectId;
  channel: 'email' | 'sms' | 'whatsapp' | 'in_app';
  type: string;
  title: string;
  message: string;
  readAt?: Date;
  metadata?: Record<string, unknown>;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    channel: { type: String, enum: ['email', 'sms', 'whatsapp', 'in_app'], required: true },
    type: { type: String, required: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    readAt: Date,
    metadata: Schema.Types.Mixed
  },
  { timestamps: true }
);

notificationSchema.plugin(softDeletePlugin);
notificationSchema.index({ user: 1, readAt: 1, createdAt: -1, isDeleted: 1 });

export const Notification = model<INotification>('Notification', notificationSchema);
