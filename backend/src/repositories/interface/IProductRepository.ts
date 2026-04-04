import { ProductsDocument } from "../../models/productsModel";

export interface IProductRepository {
  createProduct(product: Partial<ProductsDocument>): Promise<ProductsDocument>;
  updateProduct(
    id: string,
    userId: string,
    product: Partial<ProductsDocument>,
  ): Promise<ProductsDocument>;
  deleteProduct(id: string, userId: string): Promise<ProductsDocument>;
  getProduct(id: string, userId: string): Promise<ProductsDocument>;
  getAllProducts(
    userId: string,
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ products: ProductsDocument[]; totalCount: number }>;
}
