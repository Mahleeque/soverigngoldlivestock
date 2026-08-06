import { AnimalStatus } from '../constants/enums';
import { Animal } from '../models/Animal';
import { Order } from '../models/Order';
import { Payment } from '../models/Payment';
import { User } from '../models/User';
import { WhatsAppOrder } from '../models/WhatsAppOrder';
import { sendSuccess } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';

export const dashboardOverview = catchAsync(async (_req, res) => {
  const [totalUsers, totalAnimals, availableAnimals, totalOrders, totalPayments, whatsappOrders, revenue] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    Animal.countDocuments({ isDeleted: false }),
    Animal.countDocuments({ isDeleted: false, status: AnimalStatus.Available }),
    Order.countDocuments({ isDeleted: false }),
    Payment.countDocuments({ isDeleted: false }),
    WhatsAppOrder.countDocuments({ isDeleted: false }),
    Payment.aggregate([
      { $match: { isDeleted: false, status: 'successful' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
  ]);

  return sendSuccess(res, 'Dashboard overview retrieved', {
    totalUsers,
    totalAnimals,
    availableAnimals,
    totalOrders,
    totalPayments,
    whatsappOrders,
    revenue: revenue[0]?.total || 0
  });
});
