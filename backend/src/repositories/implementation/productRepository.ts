import productsModel, { ProductsDocument } from '../../models/productsModel';
import { BaseRepository } from '../baseRepository';
import { IProductRepository } from '../interface/IProductRepository';

export class ProductRepository extends BaseRepository<ProductsDocument> implements IProductRepository {
  constructor() {
    super(productsModel);
  }

  async createProduct(product: Partial<ProductsDocument>): Promise<ProductsDocument> {
    const createdProduct = await this.create(product);
    return createdProduct;
  }

  async updateProduct(id: string, userId: string, product: Partial<ProductsDocument>): Promise<ProductsDocument> {
    const updatedProduct = await this.findOneAndUpdate({ _id: id, userId }, product, { new: true });
    if (!updatedProduct) {
      throw new Error('Product not found or unauthorized');
    }
    return updatedProduct;
  }

  async deleteProduct(id: string, userId: string): Promise<ProductsDocument> {
    const deletedProduct = await this.model.findOneAndDelete({ _id: id, userId }).exec();
    if (!deletedProduct) {
      throw new Error('Product not found or unauthorized');
    }
    return deletedProduct;
  }

  async getProduct(id: string, userId: string): Promise<ProductsDocument> {
    const product = await this.findOne({ _id: id, userId });
    if (!product) {
      throw new Error('Product not found or unauthorized');
    }
    return product;
  }

  async getAllProducts(
    userId: string,
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ products: ProductsDocument[]; totalCount: number }> {
    const query: any = { userId };

    if (search) {
      query.$and = [
        { userId },
        {
          $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }],
        },
      ];
    }

    const totalCount = await this.countDocuments(query);

    let productsQuery = this.model.find(query);

    if (page && limit) {
      productsQuery = productsQuery.skip((page - 1) * limit).limit(limit);
    }

    const products = await productsQuery.exec();

    return { products, totalCount };
  }
}
