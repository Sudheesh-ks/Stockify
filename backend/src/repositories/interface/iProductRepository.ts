import { ProductsDocument } from "../../models/productsModel";

export interface IProductRepository {
    createProduct(product: Partial<ProductsDocument>): Promise<ProductsDocument>;
    updateProduct(id: string, product: Partial<ProductsDocument>): Promise<ProductsDocument>;
    deleteProduct(id: string): Promise<ProductsDocument>;
    getProduct(id: string): Promise<ProductsDocument>;
    getAllProducts(search?: string, page?: number, limit?: number): Promise<{ products: ProductsDocument[], totalCount: number }>;
}