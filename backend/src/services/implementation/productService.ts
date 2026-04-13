import { ProductDTO } from '../../dtos/product.dto';
import { toProductDTO } from '../../mappers/product.mapper';
import { ProductRepository } from '../../repositories/implementation/productRepository';
import { IProductService } from '../interface/IProductService';

export class ProductService implements IProductService {
  constructor(private readonly _productRepository: ProductRepository) {}

  async createProduct(
    userId: string,
    product: {
      name: string;
      description: string;
      quantity: number;
      price: number;
    },
  ): Promise<ProductDTO> {
    const createdProduct = await this._productRepository.createProduct({
      ...product,
      userId: userId as any,
    });
    return toProductDTO(createdProduct);
  }

  async updateProduct(
    id: string,
    userId: string,
    product: {
      name?: string;
      description?: string;
      quantity?: number;
      price?: number;
    },
  ): Promise<ProductDTO> {
    const updatedProduct = await this._productRepository.updateProduct(id, userId, product);
    return toProductDTO(updatedProduct);
  }

  async deleteProduct(id: string, userId: string): Promise<ProductDTO> {
    const deletedProduct = await this._productRepository.deleteProduct(id, userId);
    return toProductDTO(deletedProduct);
  }

  async getProduct(id: string, userId: string): Promise<ProductDTO> {
    const product = await this._productRepository.getProduct(id, userId);
    return toProductDTO(product);
  }

  async getAllProducts(
    userId: string,
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{
    products: ProductDTO[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    const { products, totalCount } = await this._productRepository.getAllProducts(userId, search, page, limit);

    const effectiveLimit = limit && limit > 0 ? limit : 10;
    const totalPages = Math.max(1, Math.ceil(totalCount / effectiveLimit));

    return {
      products: products.map(toProductDTO),
      totalCount,
      totalPages,
      currentPage: page || 1,
    };
  }
}
