import express from 'express';
import { saleController } from '../dependencyHandlers.ts/sale.dependencies';

const saleRouter = express.Router();

saleRouter.post('/', saleController.recordSale.bind(saleController));
saleRouter.get('/', saleController.getSales.bind(saleController));
saleRouter.get('/customer/:name', saleController.getSalesByCustomer.bind(saleController));

export default saleRouter;
