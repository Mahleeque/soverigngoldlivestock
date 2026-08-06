import { Order } from '../models/Order';
import { WhatsAppOrder } from '../models/WhatsAppOrder';
import { sendSuccess } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';

export const healthCheck = catchAsync(async (_req, res) => {
  return sendSuccess(res, 'API healthy', { uptime: process.uptime(), timestamp: new Date().toISOString() });
});

export const whatsappWebhook = catchAsync(async (req, res) => {
  const phone = req.body.phone || req.body.from || 'unknown';
  const conversationId = req.body.conversationId || `${phone}-${Date.now()}`;
  const body = req.body.message || req.body.text || JSON.stringify(req.body);
  const record = await WhatsAppOrder.findOneAndUpdate(
    { conversationId },
    {
      $setOnInsert: { phone, conversationId },
      $push: { messages: { direction: 'incoming', body, metadata: req.body } }
    },
    { upsert: true, new: true }
  );
  return sendSuccess(res, 'WhatsApp message recorded', record, 201);
});

export const salesSummary = catchAsync(async (_req, res) => {
  const [totalOrders, pendingOrders, revenue] = await Promise.all([
    Order.countDocuments({ isDeleted: false }),
    Order.countDocuments({ isDeleted: false, status: 'pending' }),
    Order.aggregate([
      { $match: { isDeleted: false, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
  ]);
  return sendSuccess(res, 'Sales summary retrieved', {
    totalOrders,
    pendingOrders,
    totalRevenue: revenue[0]?.total || 0
  });
});
