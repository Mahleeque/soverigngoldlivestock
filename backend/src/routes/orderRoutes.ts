import { Router } from 'express';
import { createOrder, createReservation, getMyOrder, myOrders, updateOrderStatus } from '../controllers/OrderController';
import { UserRole } from '../constants/enums';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  createOrderValidator,
  orderIdParam,
  reserveAnimalValidator,
  updateOrderStatusValidator
} from '../validators/orderValidators';

export const orderRoutes = Router();

orderRoutes.post('/', authenticate, createOrderValidator, validate, createOrder);
orderRoutes.get('/mine', authenticate, myOrders);
orderRoutes.get('/mine/:id', authenticate, orderIdParam, validate, getMyOrder);
orderRoutes.post('/reservations', authenticate, reserveAnimalValidator, validate, createReservation);
orderRoutes.patch('/:id/status', authenticate, authorize(UserRole.Admin, UserRole.Sales), orderIdParam, updateOrderStatusValidator, validate, updateOrderStatus);
