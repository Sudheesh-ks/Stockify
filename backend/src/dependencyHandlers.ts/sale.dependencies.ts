import { SaleController } from "../controllers/implementation/saleController";
import { ProductRepository } from "../repositories/implementation/productRepository";
import { SaleRepository } from "../repositories/implementation/saleRepository";
import { SaleService } from "../services/implementation/saleService";

const saleRepository = new SaleRepository();
const productRepository = new ProductRepository();
const saleService = new SaleService(saleRepository, productRepository);

export const saleController = new SaleController(saleService);
