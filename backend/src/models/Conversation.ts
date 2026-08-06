import { Document, Schema, Types, model } from 'mongoose';
import { UserRole } from '../constants/enums';
import { softDeletePlugin, SoftDeleteFields } from './plugins/softDelete';

export interface IConversationMessage {
  sender?: Types.ObjectId;
  senderRole: UserRole;
  senderName: string;
  senderEmail?: string;
  body: string;
  createdAt: Date;
}

export interface IConversation extends Document, SoftDeleteFields {
  customer?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  topic: string;
  status: 'open' | 'closed';
  lastMessageAt: Date;
  messages: IConversationMessage[];
}

const conversationMessageSchema = new Schema<IConversationMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    senderRole: { type: String, enum: Object.values(UserRole), required: true },
    senderName: { type: String, required: true, trim: true },
    senderEmail: { type: String, trim: true, lowercase: true },
    body: { type: String, required: true, trim: true, minlength: 1, maxlength: 5000 },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const conversationSchema = new Schema<IConversation>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    topic: { type: String, required: true, trim: true, maxlength: 160 },
    status: { type: String, enum: ['open', 'closed'], default: 'open', index: true },
    lastMessageAt: { type: Date, default: Date.now, index: true },
    messages: { type: [conversationMessageSchema], default: [] }
  },
  { timestamps: true }
);

conversationSchema.plugin(softDeletePlugin);
conversationSchema.index({ email: 1, isDeleted: 1, lastMessageAt: -1 });

export const Conversation = model<IConversation>('Conversation', conversationSchema);
