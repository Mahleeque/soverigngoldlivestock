import { reviewService } from '../services/ReviewService';
import { sendSuccess } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';
import { getRouteParam } from '../utils/requestParams';

export const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.create(req.user!.id, req.body);
  return sendSuccess(res, 'Review submitted for moderation', review, 201);
});

export const listAnimalReviews = catchAsync(async (req, res) => {
  const reviews = await reviewService.listForAnimal(getRouteParam(req, 'animalId'));
  return sendSuccess(res, 'Reviews retrieved', reviews);
});

export const moderateReview = catchAsync(async (req, res) => {
  const review = await reviewService.approve(getRouteParam(req, 'id'), req.body.status);
  return sendSuccess(res, 'Review moderated', review);
});
