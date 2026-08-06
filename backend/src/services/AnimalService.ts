import { FilterQuery } from 'mongoose';
import { AnimalStatus } from '../constants/enums';
import { Animal, IAnimal } from '../models/Animal';
import { AppError } from '../utils/appError';

export interface AnimalQuery {
  search?: string;
  category?: string;
  gender?: string;
  size?: string;
  status?: string;
  featured?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
  sort?: string;
}

export class AnimalService {
  async list(query: AnimalQuery) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 12), 1), 100);
    const skip = (page - 1) * limit;
    const filter: FilterQuery<IAnimal> = { isDeleted: false };

    if (query.search) filter.$text = { $search: query.search };
    if (query.category) filter.category = query.category;
    if (query.gender) filter.gender = query.gender;
    if (query.size) filter.size = query.size;
    if (query.status) filter.status = query.status;
    if (query.featured) filter.featured = query.featured === 'true';
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    const sort = query.sort || '-createdAt';
    const [items, total] = await Promise.all([
      Animal.find(filter).sort(sort).skip(skip).limit(limit),
      Animal.countDocuments(filter)
    ]);

    return {
      items,
      meta: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async getBySlug(slug: string) {
    const animal = await Animal.findOne({ slug, isDeleted: false });
    if (!animal) throw new AppError('Animal not found', 404);
    return animal;
  }

  async create(payload: Partial<IAnimal>) {
    return Animal.create(payload);
  }

  async update(id: string, payload: Partial<IAnimal>) {
    const animal = await Animal.findOneAndUpdate({ _id: id, isDeleted: false }, payload, {
      new: true,
      runValidators: true
    });
    if (!animal) throw new AppError('Animal not found', 404);
    return animal;
  }

  async remove(id: string) {
    const animal = await Animal.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!animal) throw new AppError('Animal not found', 404);
    return animal;
  }

  async reserve(id: string) {
    const animal = await Animal.findOneAndUpdate(
      { _id: id, isDeleted: false, status: AnimalStatus.Available, quantity: { $gt: 0 } },
      { status: AnimalStatus.Reserved },
      { new: true }
    );
    if (!animal) throw new AppError('Animal is not available for reservation', 409);
    return animal;
  }
}

export const animalService = new AnimalService();
