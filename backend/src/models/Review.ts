import { Document, Schema, model } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields } from './plugins/softDelete';

export interface IReview extends Document, SoftDeleteFields {
  customer: Schema.Types.ObjectId;
  animal: Schema.Types.ObjectId;
  order: Schema.Types.ObjectId;
  rating: number;
  comment: string;
  verifiedBuyer: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

const reviewSchema = new Schema<IReview>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    animal: { type: Schema.Types.ObjectId, ref: 'Animal', required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1200 },
    verifiedBuyer: { type: Boolean, default: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true }
  },
  { timestamps: true }
);

reviewSchema.plugin(softDeletePlugin);
reviewSchema.index({ customer: 1, animal: 1, order: 1 }, { unique: true });

export const Review = model<IReview>('Review', reviewSchema);
