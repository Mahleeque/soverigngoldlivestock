import { FilterQuery, Model, UpdateQuery } from 'mongoose';

export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  create(payload: Partial<T>) {
    return this.model.create(payload);
  }

  findById(id: string) {
    return this.model.findOne({ _id: id, isDeleted: false } as FilterQuery<T>);
  }

  findOne(filter: FilterQuery<T>) {
    return this.model.findOne({ ...filter, isDeleted: false });
  }

  find(filter: FilterQuery<T> = {}) {
    return this.model.find({ ...filter, isDeleted: false });
  }

  updateById(id: string, payload: UpdateQuery<T>) {
    return this.model.findOneAndUpdate({ _id: id, isDeleted: false } as FilterQuery<T>, payload, {
      new: true,
      runValidators: true
    });
  }

  softDelete(id: string) {
    return this.model.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
  }
}
