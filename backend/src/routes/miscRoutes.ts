import { Router } from 'express';
import { salesSummary, whatsappWebhook } from '../controllers/MiscController';
import { UserRole } from '../constants/enums';
import { authenticate, authorize } from '../middlewares/auth';

export const miscRoutes = Router();

miscRoutes.post('/whatsapp/webhook', whatsappWebhook);
miscRoutes.get('/reports/sales-summary', authenticate, authorize(UserRole.Admin, UserRole.Sales), salesSummary);
