import { UserRole } from '../constants/enums';
import { conversationService } from '../services/ConversationService';
import { sendSuccess } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';
import { getRouteParam } from '../utils/requestParams';

export const createConversation = catchAsync(async (req, res) => {
  const conversation = await conversationService.createContact(req.body, req.user?.id);
  return sendSuccess(res, 'Message sent to the sales desk', conversation, 201);
});

export const listMyConversations = catchAsync(async (req, res) => {
  const conversations = await conversationService.listForCustomer(req.user!.id);
  return sendSuccess(res, 'Conversations retrieved', conversations);
});

export const listStaffConversations = catchAsync(async (_req, res) => {
  const conversations = await conversationService.listForStaff();
  return sendSuccess(res, 'Conversations retrieved', conversations);
});

export const replyToConversation = catchAsync(async (req, res) => {
  const conversation = await conversationService.reply(
    getRouteParam(req, 'id'),
    { id: req.user!.id, role: req.user!.role as UserRole },
    req.body.message
  );
  return sendSuccess(res, 'Reply sent', conversation);
});
