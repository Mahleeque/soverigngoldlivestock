import { Types } from 'mongoose';
import { OrderStatus } from '../constants/enums';
import { Animal } from '../models/Animal';
import { Order } from '../models/Order';
import { Review } from '../models/Review';
import { AppError } from '../utils/appError';

export class ReviewService {
  async create(userId: string, payload: { animal: string; order: string; rating: number; comment: string }) {
    const order = await Order.findOne({
      _id: payload.order,
      customer: userId,
      status: OrderStatus.Delivered,
      isDeleted: false,
      'items.animal': payload.animal
    });
    if (!order) throw new AppError('Only verified buyers can review delivered animals', 403);

    const review = await Review.create({
      customer: userId,
      animal: payload.animal,
      order: payload.order,
      rating: payload.rating,
      comment: payload.comment,
      verifiedBuyer: true
    });
    await this.recalculateAnimalRating(payload.animal);
    return review;
  }

  async approve(reviewId: string, status: 'approved' | 'rejected') {
    const review = await Review.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { status }, { new: true });
    if (!review) throw new AppError('Review not found', 404);
    await this.recalculateAnimalRating(review.animal.toString());
    return review;
  }

  listForAnimal(animalId: string) {
    return Review.find({ animal: animalId, status: 'approved', isDeleted: false }).populate('customer', 'firstName lastName avatarUrl');
  }

  private async recalculateAnimalRating(animalId: string) {
    const stats = await Review.aggregate([
      { $match: { animal: new Types.ObjectId(animalId), status: 'approved', isDeleted: false } },
      { $group: { _id: '$animal', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ]);
    await Animal.findByIdAndUpdate(animalId, {
      averageRating: stats[0]?.averageRating || 0,
      reviewCount: stats[0]?.reviewCount || 0
    });
  }
}

export const reviewService = new ReviewService();
