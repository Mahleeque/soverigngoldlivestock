import { Router } from 'express';
import {
  createConversation,
  listMyConversations,
  replyToConversation
} from '../controllers/ConversationController';
import { authenticate, optionalAuthenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  conversationIdParam,
  createConversationValidator,
  replyConversationValidator
} from '../validators/conversationValidators';

export const conversationRoutes = Router();

conversationRoutes.post('/', optionalAuthenticate, createConversationValidator, validate, createConversation);
conversationRoutes.use(authenticate);
conversationRoutes.get('/mine', listMyConversations);
conversationRoutes.post('/:id/messages', conversationIdParam, replyConversationValidator, validate, replyToConversation);
