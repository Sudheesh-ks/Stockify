import productsModel, { ProductsDocument } from "../../models/productsModel";
import { BaseRepository } from "../baseRepository";
import { IProductRepository } from "../interface/iProductRepository";

export class ProductRepository extends BaseRepository<ProductsDocument> implements IProductRepository {
    constructor() {
        super(productsModel);
    }

    async createProduct(product: Partial<ProductsDocument>): Promise<ProductsDocument> {
        const createdProduct = await this.create(product);
        return createdProduct;
    }

    async updateProduct(id: string, product: Partial<ProductsDocument>): Promise<ProductsDocument> {
        const updatedProduct = await this.updateById(id, product);
            if (!updatedProduct) {
        throw new Error("Product not found");
    }
        return updatedProduct;
    }

    async deleteProduct(id: string): Promise<ProductsDocument> {
        const deletedProduct = await this.deleteById(id);
        if (!deletedProduct) {
            throw new Error("Product not found");
        }
        return deletedProduct;
    }

    async getProduct(id: string): Promise<ProductsDocument> {
        const product = await this.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }

    async getAllProducts(search?: string, page?: number, limit?: number): Promise<{ products: ProductsDocument[], totalCount: number }> {
        const query = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { description: { $regex: search, $options: "i" } },
                  ],
              }
            : {};
        
        const totalCount = await this.countDocuments(query);
        
        let productsQuery = this.model.find(query);
        
        if (page && limit) {
            productsQuery = productsQuery.skip((page - 1) * limit).limit(limit);
        }

        const products = await productsQuery.exec();

        return { products, totalCount };
    }
}