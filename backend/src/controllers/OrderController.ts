import { orderService } from '../services/OrderService';
import { sendSuccess } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';
import { getRouteParam } from '../utils/requestParams';

export const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.create({ ...req.body, customer: req.user?.id });
  return sendSuccess(res, 'Order created', order, 201);
});

export const myOrders = catchAsync(async (req, res) => {
  const orders = await orderService.listForCustomer(req.user!.id);
  return sendSuccess(res, 'Orders retrieved', orders);
});

export const getMyOrder = catchAsync(async (req, res) => {
  const order = await orderService.getForCustomer(req.user!.id, getRouteParam(req, 'id'));
  return sendSuccess(res, 'Order retrieved', order);
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateStatus(getRouteParam(req, 'id'), req.body, req.user?.id);
  return sendSuccess(res, 'Order status updated', order);
});

export const createReservation = catchAsync(async (req, res) => {
  const reservation = await orderService.reserve(req.user!.id, req.body.animalId);
  return sendSuccess(res, 'Reservation created', reservation, 201);
});
