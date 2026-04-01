import { ProductDTO } from "../../dtos/product.dto";
import { toProductDTO } from "../../mappers/product.mapper";
import { ProductRepository } from "../../repositories/implementation/productRepository";
import { IProductService } from "../interface/iProductService";

export class ProductService implements IProductService {
    constructor(
        private readonly _productRepository: ProductRepository,
    ) {}

    async createProduct(product: {name: string, description: string, quantity: number, price: number}): Promise<ProductDTO> {
        const createdProduct = await this._productRepository.createProduct(product);
        return toProductDTO(createdProduct);
    }

    async updateProduct(id: string, product: {name?: string, description?: string, quantity?: number, price?: number}): Promise<ProductDTO> {
        const updatedProduct = await this._productRepository.updateProduct(id, product);
        return toProductDTO(updatedProduct);
    }

    async deleteProduct(id: string): Promise<ProductDTO> {
        const deletedProduct = await this._productRepository.deleteProduct(id);
        return toProductDTO(deletedProduct);
    }

    async getProduct(id: string): Promise<ProductDTO> {
        const product = await this._productRepository.getProduct(id);
        return toProductDTO(product);
    }

    async getAllProducts(search?: string, page?: number, limit?: number): Promise<{ products: ProductDTO[], totalCount: number, totalPages: number, currentPage: number }> {
        const { products, totalCount } = await this._productRepository.getAllProducts(search, page, limit);
        
        const effectiveLimit = limit && limit > 0 ? limit : 10;
        const totalPages = Math.max(1, Math.ceil(totalCount / effectiveLimit));
        
        return {
            products: products.map(toProductDTO),
            totalCount,
            totalPages,
            currentPage: page || 1
        };
    }
}
    