import { ProductDTO } from "../../dtos/product.dto";

export interface IProductService {
    createProduct(product: {name: string, description: string, quantity: number, price: number}): Promise<ProductDTO>;
    updateProduct(id: string, product: {name?: string, description?: string, quantity?: number, price?: number}): Promise<ProductDTO>;
    deleteProduct(id: string): Promise<ProductDTO>;
    getProduct(id: string): Promise<ProductDTO>;
    getAllProducts(search?: string, page?: number, limit?: number): Promise<{ products: ProductDTO[], totalCount: number, totalPages: number, currentPage: number }>;
}