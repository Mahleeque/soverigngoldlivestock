import { AuditLog } from '../models/AuditLog';
import { sendSuccess } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';

export const listAuditLogs = catchAsync(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
  const skip = (page - 1) * limit;
  const filter = { isDeleted: false };
  const [logs, total] = await Promise.all([
    AuditLog.find(filter).populate('actor', 'firstName lastName email role').sort('-createdAt').skip(skip).limit(limit),
    AuditLog.countDocuments(filter)
  ]);
  return sendSuccess(res, 'Audit logs retrieved', logs, 200, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  });
});
