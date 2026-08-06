import { Types } from 'mongoose';
import { AnimalStatus, DeliveryStatus, OrderStatus, PaymentStatus } from '../constants/enums';
import { Animal, IAnimal } from '../models/Animal';
import { Coupon } from '../models/Coupon';
import { Order } from '../models/Order';
import { Reservation } from '../models/Reservation';
import { AppError } from '../utils/appError';

export class OrderService {
  async create(payload: {
    customer?: string;
    source?: 'website' | 'whatsapp' | 'manual';
    items: { animal: string; quantity: number }[];
    deliveryAddress: {
      fullName: string;
      phone: string;
      addressLine: string;
      city: string;
      state: string;
    };
    deliveryFee?: number;
    couponCode?: string;
  }) {
    const reservedAnimals: { animal: IAnimal; quantity: number }[] = [];
    try {
      for (const item of payload.items) {
        const animal = await this.reserveInventory(item.animal, item.quantity);
        reservedAnimals.push({ animal, quantity: item.quantity });
      }
    } catch (error) {
      await this.releaseInventory(reservedAnimals);
      throw error;
    }

    const items = reservedAnimals.map(({ animal, quantity }) => {
      return {
        animal: animal._id,
        name: animal.name,
        quantity,
        unitPrice: animal.price,
        total: animal.price * quantity
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const deliveryFee = payload.deliveryFee || 0;
    const coupon = payload.couponCode
      ? await Coupon.findOne({
          code: payload.couponCode.toUpperCase(),
          active: true,
          isDeleted: false,
          startsAt: { $lte: new Date() },
          expiresAt: { $gte: new Date() }
        })
      : null;
    const discount = coupon
      ? Math.min(coupon.type === 'percentage' ? subtotal * (coupon.value / 100) : coupon.value, coupon.maxDiscountAmount || subtotal, subtotal)
      : 0;
    const total = subtotal + deliveryFee - discount;
    const orderNumber = `SGL-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    return Order.create({
      orderNumber,
      customer: payload.customer ? new Types.ObjectId(payload.customer) : undefined,
      source: payload.source || 'website',
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      depositDue: Math.round(total * 0.3),
      balanceDue: Math.round(total * 0.7),
      deliveryAddress: payload.deliveryAddress,
      statusHistory: [{ status: OrderStatus.Pending, note: 'Order created' }],
      coupon: coupon?._id
    });
  }

  listForCustomer(customer: string) {
    return Order.find({ customer, isDeleted: false }).populate('items.animal').sort('-createdAt');
  }

  async getForCustomer(customer: string, id: string) {
    const order = await Order.findOne({ _id: id, customer, isDeleted: false }).populate('items.animal deliveryZone');
    if (!order) throw new AppError('Order not found', 404);
    return order;
  }

  async updateStatus(
    id: string,
    payload: { status?: OrderStatus; paymentStatus?: PaymentStatus; deliveryStatus?: DeliveryStatus; note?: string },
    changedBy?: string
  ) {
    const update: Record<string, unknown> = {};
    if (payload.status) update.status = payload.status;
    if (payload.paymentStatus) update.paymentStatus = payload.paymentStatus;
    if (payload.deliveryStatus) update.deliveryStatus = payload.deliveryStatus;
    if (payload.status) {
      update.$push = {
        statusHistory: {
          status: payload.status,
          note: payload.note,
          changedBy,
          changedAt: new Date()
        }
      };
    }
    const order = await Order.findOneAndUpdate({ _id: id, isDeleted: false }, update, { new: true, runValidators: true });
    if (!order) throw new AppError('Order not found', 404);
    return order;
  }

  async reserve(userId: string, animalId: string) {
    const animal = await this.reserveInventory(animalId, 1);
    return Reservation.create({
      customer: userId,
      animal: animal._id,
      depositAmount: animal.depositAmount,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      status: 'active'
    });
  }

  private async reserveInventory(animalId: string, quantity: number) {
    const animal = await Animal.findOneAndUpdate(
      {
        _id: animalId,
        isDeleted: false,
        status: AnimalStatus.Available,
        quantity: { $gte: quantity }
      },
      [
        {
          $set: {
            quantity: { $subtract: ['$quantity', quantity] },
            status: {
              $cond: [
                { $eq: [{ $subtract: ['$quantity', quantity] }, 0] },
                AnimalStatus.Reserved,
                '$status'
              ]
            }
          }
        }
      ],
      { new: true, runValidators: true }
    );
    if (!animal) throw new AppError('Animal is not available in the requested quantity', 409);
    return animal;
  }

  private async releaseInventory(items: { animal: IAnimal; quantity: number }[]) {
    await Promise.all(
      items.map(({ animal, quantity }) =>
        Animal.findByIdAndUpdate(animal._id, {
          $inc: { quantity },
          $set: { status: AnimalStatus.Available }
        })
      )
    );
  }
}

export const orderService = new OrderService();
