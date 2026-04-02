import express from 'express';
import { customerController } from '../dependencyHandlers.ts/customer.dependencies';
import authMiddleware from '../middlewares/authMiddleware';

const customerRouter = express.Router();

customerRouter.post('/customer', authMiddleware(), customerController.createCustomer.bind(customerController));
customerRouter.put('/customer/:id', authMiddleware(), customerController.updateCustomer.bind(customerController));
customerRouter.delete('/customer/:id', authMiddleware(), customerController.deleteCustomer.bind(customerController));
customerRouter.get('/customer/:id', authMiddleware(), customerController.getCustomer.bind(customerController));
customerRouter.get('/customer', authMiddleware(), customerController.getAllCustomers.bind(customerController));

export default customerRouter;
