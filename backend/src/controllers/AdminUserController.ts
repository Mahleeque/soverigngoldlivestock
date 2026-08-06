import { UserRole } from '../constants/enums';
import { adminUserService } from '../services/AdminUserService';
import { sendSuccess } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';
import { getRouteParam } from '../utils/requestParams';

export const listUsers = catchAsync(async (req, res) => {
  const result = await adminUserService.list(req.query);
  return sendSuccess(res, 'Users retrieved', result.items, 200, result.meta);
});

export const updateUserRole = catchAsync(async (req, res) => {
  const user = await adminUserService.setRole(req.user!.id, getRouteParam(req, 'id'), req.body.role as UserRole);
  return sendSuccess(res, 'User role updated', user);
});

export const updateUserBlocked = catchAsync(async (req, res) => {
  const user = await adminUserService.setBlocked(req.user!.id, getRouteParam(req, 'id'), Boolean(req.body.blocked));
  return sendSuccess(res, req.body.blocked ? 'User blocked' : 'User unblocked', user);
});

export const removeUser = catchAsync(async (req, res) => {
  const user = await adminUserService.remove(req.user!.id, getRouteParam(req, 'id'));
  return sendSuccess(res, 'User removed', user);
});
