import { checkoutService } from '../services/CheckoutService';
import { sendSuccess } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';

export const listDeliveryZones = catchAsync(async (_req, res) => {
  const zones = await checkoutService.listDeliveryZones();
  return sendSuccess(res, 'Delivery zones retrieved', zones);
});

export const listActiveCoupons = catchAsync(async (_req, res) => {
  const coupons = await checkoutService.listActiveCoupons();
  return sendSuccess(res, 'Active coupons retrieved', coupons);
});

export const validateCoupon = catchAsync(async (req, res) => {
  const result = await checkoutService.validateCoupon(req.body.code, Number(req.body.subtotal));
  return sendSuccess(res, 'Coupon validated', result);
});
