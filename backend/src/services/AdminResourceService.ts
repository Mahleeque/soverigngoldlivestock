import { Model, UpdateQuery } from 'mongoose';
import { Coupon } from '../models/Coupon';
import { DeliveryZone } from '../models/DeliveryZone';
import { Order } from '../models/Order';
import { Payment } from '../models/Payment';
import { WebsiteSettings } from '../models/WebsiteSettings';
import { AppError } from '../utils/appError';

const resources = {
  deliveryZones: DeliveryZone,
  coupons: Coupon,
  settings: WebsiteSettings,
  orders: Order,
  payments: Payment
} as const;

type ResourceName = keyof typeof resources;

export class AdminResourceService {
  private model(name: string): Model<any> {
    const model = resources[name as ResourceName];
    if (!model) throw new AppError('Unsupported admin resource', 404);
    return model;
  }

  list(name: string) {
    if (name === 'orders') {
      return this.model(name).find({ isDeleted: false }).populate('customer', 'firstName lastName email phone').sort('-createdAt');
    }
    return this.model(name).find({ isDeleted: false }).sort('-createdAt');
  }

  async create(name: string, payload: unknown) {
    return this.model(name).create(payload);
  }

  async update(name: string, id: string, payload: UpdateQuery<unknown>) {
    const item = await this.model(name).findOneAndUpdate({ _id: id, isDeleted: false }, payload, {
      new: true,
      runValidators: true
    });
    if (!item) throw new AppError('Resource not found', 404);
    return item;
  }

  async remove(name: string, id: string) {
    const item = await this.model(name).findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!item) throw new AppError('Resource not found', 404);
    return item;
  }
}

export const adminResourceService = new AdminResourceService();
