import { Document, Schema, model } from 'mongoose';

export interface IAuditLog extends Document {
  actor?: Schema.Types.ObjectId;
  action: string;
  entity: string;
  entityId?: string;
  ip?: string;
  userAgent?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  isDeleted: boolean;
  deletedAt?: Date | null;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true, trim: true, index: true },
    entity: { type: String, required: true, trim: true, index: true },
    entityId: { type: String, index: true },
    ip: String,
    userAgent: String,
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
