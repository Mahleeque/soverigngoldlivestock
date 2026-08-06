import { Document, Schema, model } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields } from './plugins/softDelete';

export interface IWebsiteSettings extends Document, SoftDeleteFields {
  key: string;
  value: Record<string, unknown>;
  updatedBy?: Schema.Types.ObjectId;
}

const websiteSettingsSchema = new Schema<IWebsiteSettings>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

websiteSettingsSchema.plugin(softDeletePlugin);

export const WebsiteSettings = model<IWebsiteSettings>('WebsiteSettings', websiteSettingsSchema);
