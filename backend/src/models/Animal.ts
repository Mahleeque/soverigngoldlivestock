import { Document, Schema, model } from 'mongoose';
import { AnimalCategory, AnimalStatus } from '../constants/enums';
import { makeSlug } from '../utils/slug';
import { softDeletePlugin, SoftDeleteFields } from './plugins/softDelete';

export interface IAnimal extends Document, SoftDeleteFields {
  name: string;
  slug: string;
  category: AnimalCategory;
  breed: string;
  description: string;
  price: number;
  depositAmount: number;
  weightKg: number;
  ageMonths: number;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  healthStatus: string;
  vaccinationStatus: string;
  images: string[];
  videos: string[];
  healthCertificateUrl?: string;
  status: AnimalStatus;
  quantity: number;
  featured: boolean;
  sku: string;
  tags: string[];
  averageRating: number;
  reviewCount: number;
}

const animalSchema = new Schema<IAnimal>(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, enum: Object.values(AnimalCategory), required: true, index: true },
    breed: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    price: { type: Number, required: true, min: 0, index: true },
    depositAmount: { type: Number, default: 0, min: 0 },
    weightKg: { type: Number, required: true, min: 0 },
    ageMonths: { type: Number, required: true, min: 0 },
    gender: { type: String, enum: ['male', 'female'], required: true, index: true },
    size: { type: String, enum: ['small', 'medium', 'large'], required: true, index: true },
    healthStatus: { type: String, required: true, trim: true },
    vaccinationStatus: { type: String, required: true, trim: true },
    images: [{ type: String, required: true }],
    videos: [{ type: String }],
    healthCertificateUrl: String,
    status: { type: String, enum: Object.values(AnimalStatus), default: AnimalStatus.Available, index: true },
    quantity: { type: Number, default: 1, min: 0 },
    featured: { type: Boolean, default: false, index: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

animalSchema.plugin(softDeletePlugin);
animalSchema.index({ name: 'text', breed: 'text', description: 'text', tags: 'text' });
animalSchema.index({ category: 1, status: 1, featured: 1, isDeleted: 1 });

animalSchema.pre('validate', function setIdentifiers(next) {
  if (!this.sku && this.name) {
    this.sku = `${makeSlug(this.name).slice(0, 12).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  }
  if (!this.slug && this.name) this.slug = makeSlug(`${this.name}-${this.sku || Date.now()}`);
  next();
});

export const Animal = model<IAnimal>('Animal', animalSchema);
