import { FilterQuery } from 'mongoose';
import { UserRole } from '../constants/enums';
import { IUser, User } from '../models/User';
import { AppError } from '../utils/appError';

export interface AdminUserQuery {
  search?: string;
  role?: string;
  status?: 'active' | 'blocked' | string;
  page?: string;
  limit?: string;
}

const PUBLIC_FIELDS =
  'firstName lastName email phone role isBlocked blockedAt lastLoginAt emailVerified createdAt';

export class AdminUserService {
  async list(query: AdminUserQuery) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 25), 1), 100);
    const filter: FilterQuery<IUser> = { isDeleted: false };

    if (query.role) filter.role = query.role;
    if (query.status === 'blocked') filter.isBlocked = true;
    if (query.status === 'active') filter.isBlocked = false;
    if (query.search) {
      const term = new RegExp(query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ firstName: term }, { lastName: term }, { email: term }, { phone: term }];
    }

    const [items, total] = await Promise.all([
      User.find(filter)
        .select(PUBLIC_FIELDS)
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async setRole(actorId: string, userId: string, role: UserRole) {
    if (actorId === userId) throw new AppError('You cannot change your own role', 400);
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) throw new AppError('User not found', 404);
    user.role = role;
    user.tokenVersion += 1;
    await user.save({ validateBeforeSave: false });
    return User.findById(userId).select(PUBLIC_FIELDS);
  }

  async setBlocked(actorId: string, userId: string, blocked: boolean) {
    if (actorId === userId) throw new AppError('You cannot block your own account', 400);
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) throw new AppError('User not found', 404);
    if (user.role === UserRole.Admin) throw new AppError('Administrator accounts cannot be blocked', 400);
    user.isBlocked = blocked;
    user.blockedAt = blocked ? new Date() : null;
    if (blocked) user.tokenVersion += 1;
    await user.save({ validateBeforeSave: false });
    return User.findById(userId).select(PUBLIC_FIELDS);
  }

  async remove(actorId: string, userId: string) {
    if (actorId === userId) throw new AppError('You cannot delete your own account', 400);
    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false, role: { $ne: UserRole.Admin } },
      { isDeleted: true, deletedAt: new Date(), $inc: { tokenVersion: 1 } },
      { new: true }
    ).select(PUBLIC_FIELDS);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }
}

export const adminUserService = new AdminUserService();
