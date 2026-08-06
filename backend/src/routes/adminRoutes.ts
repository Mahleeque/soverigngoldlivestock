import { Router } from 'express';
import {
  createResource,
  deleteResource,
  listResource,
  updateResource
} from '../controllers/AdminResourceController';
import { dashboardOverview } from '../controllers/AdminDashboardController';
import { listUsers, removeUser, updateUserBlocked, updateUserRole } from '../controllers/AdminUserController';
import { listAuditLogs } from '../controllers/AuditLogController';
import { listStaffConversations } from '../controllers/ConversationController';
import { UserRole } from '../constants/enums';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  resourceIdParam,
  resourceParam,
  userBlockedValidator,
  userIdParam,
  userRoleValidator
} from '../validators/adminResourceValidators';

export const adminRoutes = Router();

const adminOnly = authorize(UserRole.Admin);

adminRoutes.use(authenticate, authorize(UserRole.Admin, UserRole.Sales));

adminRoutes.get('/dashboard/overview', dashboardOverview);
adminRoutes.get('/audit-logs', adminOnly, listAuditLogs);
adminRoutes.get('/conversations', listStaffConversations);

adminRoutes.get('/users', adminOnly, listUsers);
adminRoutes.patch('/users/:id/role', adminOnly, userIdParam, userRoleValidator, validate, updateUserRole);
adminRoutes.patch('/users/:id/blocked', adminOnly, userIdParam, userBlockedValidator, validate, updateUserBlocked);
adminRoutes.delete('/users/:id', adminOnly, userIdParam, validate, removeUser);

adminRoutes.get('/:resource', resourceParam, validate, listResource);
adminRoutes.post('/:resource', resourceParam, validate, createResource);
adminRoutes.patch('/:resource/:id', resourceParam, resourceIdParam, validate, updateResource);
adminRoutes.delete('/:resource/:id', resourceParam, resourceIdParam, validate, deleteResource);
