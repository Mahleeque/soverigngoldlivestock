import { Types } from 'mongoose';
import { UserRole } from '../constants/enums';
import { Conversation, IConversation } from '../models/Conversation';
import { User } from '../models/User';
import { AppError } from '../utils/appError';
import { notificationService } from './NotificationService';

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

const preview = (message: string) => (message.length > 140 ? `${message.slice(0, 137)}...` : message);

export class ConversationService {
  async createContact(payload: ContactPayload, requesterId?: string) {
    const requester = requesterId
      ? await User.findOne({ _id: requesterId, isDeleted: false }).select('firstName lastName email phone role')
      : null;
    const matchedCustomer =
      requester ??
      (await User.findOne({ email: payload.email.toLowerCase(), isDeleted: false }).select(
        'firstName lastName email phone role'
      ));

    const conversation = await Conversation.create({
      customer: matchedCustomer?._id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      topic: payload.topic,
      lastMessageAt: new Date(),
      messages: [
        {
          sender: matchedCustomer?._id,
          senderRole: UserRole.Customer,
          senderName: payload.name,
          senderEmail: payload.email,
          body: payload.message
        }
      ]
    });

    await this.notifyStaff(conversation, payload.message, 'New client message');
    return conversation;
  }

  async listForStaff() {
    return Conversation.find({ isDeleted: false }).sort({ lastMessageAt: -1 }).limit(100).lean();
  }

  async listForCustomer(customerId: string) {
    return Conversation.find({ customer: customerId, isDeleted: false }).sort({ lastMessageAt: -1 }).lean();
  }

  async reply(conversationId: string, sender: { id: string; role: UserRole }, body: string) {
    const conversation = await Conversation.findOne({ _id: conversationId, isDeleted: false });
    if (!conversation) throw new AppError('Conversation not found', 404);

    const user = await User.findOne({ _id: sender.id, isDeleted: false }).select('firstName lastName email role');
    if (!user) throw new AppError('User not found', 404);

    const isStaff = sender.role === UserRole.Admin || sender.role === UserRole.Sales;
    const isCustomer =
      sender.role === UserRole.Customer &&
      conversation.customer &&
      new Types.ObjectId(sender.id).equals(conversation.customer as unknown as Types.ObjectId);
    if (!isStaff && !isCustomer) throw new AppError('You cannot reply to this conversation', 403);

    conversation.messages.push({
      sender: user._id as unknown as Types.ObjectId,
      senderRole: sender.role,
      senderName: `${user.firstName} ${user.lastName}`,
      senderEmail: user.email,
      body,
      createdAt: new Date()
    });
    conversation.status = 'open';
    conversation.lastMessageAt = new Date();
    await conversation.save();

    if (isStaff) {
      await this.notifyCustomer(conversation, body, `${user.firstName} from Sovereign Gold replied`);
    } else {
      await this.notifyStaff(conversation, body, `${user.firstName} replied`);
    }

    return conversation;
  }

  private async notifyStaff(conversation: IConversation, message: string, title: string) {
    const staff = await User.find({
      role: { $in: [UserRole.Admin, UserRole.Sales] },
      isBlocked: false,
      isDeleted: false
    }).select('_id');

    await Promise.all(
      staff.map((user) =>
        notificationService.create({
          user: String(user._id),
          channel: 'in_app',
          type: 'conversation',
          title,
          message: `${conversation.name}: ${preview(message)}`,
          metadata: { conversationId: String(conversation._id) }
        })
      )
    );
  }

  private async notifyCustomer(conversation: IConversation, message: string, title: string) {
    if (!conversation.customer) return;
    await notificationService.create({
      user: String(conversation.customer),
      channel: 'in_app',
      type: 'conversation',
      title,
      message: preview(message),
      metadata: { conversationId: String(conversation._id) }
    });
  }
}

export const conversationService = new ConversationService();
