import express from 'express';
import { saleController } from '../dependencyHandlers.ts/sale.dependencies';
import authMiddleware from '../middlewares/authMiddleware';

const saleRouter = express.Router();

saleRouter.post('/', authMiddleware(), saleController.recordSale.bind(saleController));
saleRouter.get('/', authMiddleware(), saleController.getSales.bind(saleController));
saleRouter.get('/customer/:name', authMiddleware(), saleController.getSalesByCustomer.bind(saleController));

export default saleRouter;
