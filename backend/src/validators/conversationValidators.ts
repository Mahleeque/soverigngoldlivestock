import { body, param } from 'express-validator';

export const createConversationValidator = [
  body('name').trim().isLength({ min: 2, max: 160 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 7, max: 30 }),
  body('topic').trim().isLength({ min: 2, max: 160 }),
  body('message').trim().isLength({ min: 10, max: 5000 })
];

export const conversationIdParam = [param('id').isMongoId()];

export const replyConversationValidator = [body('message').trim().isLength({ min: 1, max: 5000 })];
