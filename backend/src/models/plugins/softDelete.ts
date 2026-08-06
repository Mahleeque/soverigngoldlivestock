import { Schema } from 'mongoose';

export interface SoftDeleteFields {
  isDeleted: boolean;
  deletedAt?: Date | null;
}

export const softDeletePlugin = (schema: Schema): void => {
  schema.add({
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null }
  });
};
