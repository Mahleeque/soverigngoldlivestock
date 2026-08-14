import { Coupon } from '../models/Coupon';
import { DeliveryZone } from '../models/DeliveryZone';
import { AppError } from '../utils/appError';

export class CheckoutService {
  listDeliveryZones() {
    return DeliveryZone.find({ active: true, isDeleted: false }).sort('name');
  }

  listActiveCoupons() {
    const now = new Date();
    return Coupon.find({
      active: true,
      isDeleted: false,
      startsAt: { $lte: now },
      expiresAt: { $gte: now }
    })
      .select('code type value minOrderAmount maxDiscountAmount startsAt expiresAt')
      .sort('-value');
  }

  async validateCoupon(code: string, subtotal: number) {
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
      isDeleted: false,
      startsAt: { $lte: new Date() },
      expiresAt: { $gte: new Date() }
    });
    if (!coupon) throw new AppError('Coupon is invalid or expired', 404);
    if (subtotal < coupon.minOrderAmount) throw new AppError('Order does not meet coupon minimum amount', 422);
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new AppError('Coupon usage limit reached', 409);

    const rawDiscount = coupon.type === 'percentage' ? subtotal * (coupon.value / 100) : coupon.value;
    const discount = Math.min(rawDiscount, coupon.maxDiscountAmount || rawDiscount, subtotal);
    return { coupon, discount };
  }
}

export const checkoutService = new CheckoutService();
