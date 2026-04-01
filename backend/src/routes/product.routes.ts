import express from 'express';
import { productController } from '../dependencyHandlers.ts/product.dependencies';

const productRouter = express.Router();


productRouter.post('/product', productController.createProduct.bind(productController));
productRouter.put('/product/:id', productController.updateProduct.bind(productController));
productRouter.delete('/product/:id', productController.deleteProduct.bind(productController));
productRouter.get('/product/:id', productController.getProduct.bind(productController));
productRouter.get('/product', productController.getAllProducts.bind(productController));

export default productRouter;