import { notificationService } from '../services/NotificationService';
import { sendSuccess } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';
import { getRouteParam } from '../utils/requestParams';

export const markNotificationRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markRead(req.user!.id, getRouteParam(req, 'id'));
  return sendSuccess(res, 'Notification marked as read', notification);
});
