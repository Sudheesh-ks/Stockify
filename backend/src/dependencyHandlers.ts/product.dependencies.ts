import { ProductController } from "../controllers/implementation/productController";
import { ProductRepository } from "../repositories/implementation/productRepository";
import { ProductService } from "../services/implementation/productService";

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

export const productController = new ProductController(productService);
