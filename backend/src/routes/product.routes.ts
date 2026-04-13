import express from 'express';
import { productController } from '../dependencyHandlers.ts/product.dependencies';
import authMiddleware from '../middlewares/authMiddleware';

const productRouter = express.Router();

productRouter.post('/product', authMiddleware(), productController.createProduct.bind(productController));
productRouter.put('/product/:id', authMiddleware(), productController.updateProduct.bind(productController));
productRouter.delete('/product/:id', authMiddleware(), productController.deleteProduct.bind(productController));
productRouter.get('/product/:id', authMiddleware(), productController.getProduct.bind(productController));
productRouter.get('/product', authMiddleware(), productController.getAllProducts.bind(productController));

export default productRouter;
