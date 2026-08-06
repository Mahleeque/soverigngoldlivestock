import { Animal } from '../models/Animal';
import { Notification } from '../models/Notification';
import { Reservation } from '../models/Reservation';
import { User } from '../models/User';
import { AppError } from '../utils/appError';

export class UserService {
  async profile(userId: string) {
    const user = await User.findOne({ _id: userId, isDeleted: false }).populate('wishlist');
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async updateProfile(userId: string, payload: { firstName?: string; lastName?: string; phone?: string; avatarUrl?: string }) {
    const user = await User.findOneAndUpdate({ _id: userId, isDeleted: false }, payload, { new: true, runValidators: true });
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async addAddress(userId: string, address: unknown) {
    const user = await User.findOneAndUpdate({ _id: userId, isDeleted: false }, { $push: { addresses: address } }, { new: true });
    if (!user) throw new AppError('User not found', 404);
    return user.addresses;
  }

  async toggleWishlist(userId: string, animalId: string) {
    const animal = await Animal.findOne({ _id: animalId, isDeleted: false });
    if (!animal) throw new AppError('Animal not found', 404);
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) throw new AppError('User not found', 404);
    const exists = user.wishlist.some((id) => id.toString() === animalId);
    await User.findByIdAndUpdate(userId, exists ? { $pull: { wishlist: animalId } } : { $addToSet: { wishlist: animalId } });
    return { wished: !exists };
  }

  reservations(userId: string) {
    return Reservation.find({ customer: userId, isDeleted: false }).populate('animal').sort('-createdAt');
  }

  notifications(userId: string) {
    return Notification.find({ user: userId, isDeleted: false }).sort('-createdAt').limit(50);
  }
}

export const userService = new UserService();
