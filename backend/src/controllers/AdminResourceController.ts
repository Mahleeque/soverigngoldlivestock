import { adminResourceService } from '../services/AdminResourceService';
import { auditService } from '../services/AuditService';
import { sendSuccess } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';
import { getRouteParam } from '../utils/requestParams';

export const listResource = catchAsync(async (req, res) => {
  const resource = getRouteParam(req, 'resource');
  const items = await adminResourceService.list(resource);
  return sendSuccess(res, 'Resource retrieved', items);
});

export const createResource = catchAsync(async (req, res) => {
  const resource = getRouteParam(req, 'resource');
  const item = await adminResourceService.create(resource, req.body);
  await auditService.record(req, 'create', resource, item.id, item);
  return sendSuccess(res, 'Resource created', item, 201);
});

export const updateResource = catchAsync(async (req, res) => {
  const resource = getRouteParam(req, 'resource');
  const id = getRouteParam(req, 'id');
  const item = await adminResourceService.update(resource, id, req.body);
  await auditService.record(req, 'update', resource, id, item);
  return sendSuccess(res, 'Resource updated', item);
});

export const deleteResource = catchAsync(async (req, res) => {
  const resource = getRouteParam(req, 'resource');
  const id = getRouteParam(req, 'id');
  const item = await adminResourceService.remove(resource, id);
  await auditService.record(req, 'delete', resource, id, item);
  return sendSuccess(res, 'Resource deleted', item);
});
