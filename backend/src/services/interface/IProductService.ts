import { ProductDTO } from "../../dtos/product.dto";

export interface IProductService {
    createProduct(userId: string, product: {name: string, description: string, quantity: number, price: number}): Promise<ProductDTO>;
    updateProduct(id: string, userId: string, product: {name?: string, description?: string, quantity?: number, price?: number}): Promise<ProductDTO>;
    deleteProduct(id: string, userId: string): Promise<ProductDTO>;
    getProduct(id: string, userId: string): Promise<ProductDTO>;
    getAllProducts(userId: string, search?: string, page?: number, limit?: number): Promise<{ products: ProductDTO[], totalCount: number, totalPages: number, currentPage: number }>;
}