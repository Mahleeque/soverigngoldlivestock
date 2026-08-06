import { userService } from '../services/UserService';
import { sendSuccess } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';
import { getRouteParam } from '../utils/requestParams';

export const getProfile = catchAsync(async (req, res) => {
  const user = await userService.profile(req.user!.id);
  return sendSuccess(res, 'Profile retrieved', user);
});

export const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user!.id, req.body);
  return sendSuccess(res, 'Profile updated', user);
});

export const addAddress = catchAsync(async (req, res) => {
  const addresses = await userService.addAddress(req.user!.id, req.body);
  return sendSuccess(res, 'Address added', addresses, 201);
});

export const toggleWishlist = catchAsync(async (req, res) => {
  const result = await userService.toggleWishlist(req.user!.id, getRouteParam(req, 'animalId'));
  return sendSuccess(res, result.wished ? 'Added to wishlist' : 'Removed from wishlist', result);
});

export const myReservations = catchAsync(async (req, res) => {
  const reservations = await userService.reservations(req.user!.id);
  return sendSuccess(res, 'Reservations retrieved', reservations);
});

export const myNotifications = catchAsync(async (req, res) => {
  const notifications = await userService.notifications(req.user!.id);
  return sendSuccess(res, 'Notifications retrieved', notifications);
});
