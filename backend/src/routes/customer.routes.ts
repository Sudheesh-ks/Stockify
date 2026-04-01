import express from 'express';
import { customerController } from '../dependencyHandlers.ts/customer.dependencies';

const customerRouter = express.Router();

customerRouter.post('/customer', customerController.createCustomer.bind(customerController));
customerRouter.put('/customer/:id', customerController.updateCustomer.bind(customerController));
customerRouter.delete('/customer/:id', customerController.deleteCustomer.bind(customerController));
customerRouter.get('/customer/:id', customerController.getCustomer.bind(customerController));
customerRouter.get('/customer', customerController.getAllCustomers.bind(customerController));

export default customerRouter;
