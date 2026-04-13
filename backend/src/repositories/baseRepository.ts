import { Model, UpdateQuery, HydratedDocument } from 'mongoose';

type FilterQuery<T> = Partial<Record<keyof T, any>>;

export class BaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async findById(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<HydratedDocument<T> | null> {
    return this.model.findOne(filter).exec();
  }

  async findAll(filter: FilterQuery<T> = {}): Promise<HydratedDocument<T>[]> {
    return this.model.find(filter).exec();
  }

  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    const created = new this.model(data);
    return (await created.save()) as HydratedDocument<T>;
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<HydratedDocument<T> | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteById(id: string): Promise<HydratedDocument<T> | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: object = {},
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOneAndUpdate(filter, update, options).exec();
  }

  async countDocuments(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async deleteOne(filter: FilterQuery<T>): Promise<void> {
    await this.model.deleteOne(filter).exec();
  }
}
