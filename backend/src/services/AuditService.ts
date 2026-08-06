import { Request } from 'express';
import { AuditLog } from '../models/AuditLog';

export class AuditService {
  async record(req: Request, action: string, entity: string, entityId?: string, after?: unknown) {
    await AuditLog.create({
      actor: req.user?.id,
      action,
      entity,
      entityId,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      after
    });
  }
}

export const auditService = new AuditService();
