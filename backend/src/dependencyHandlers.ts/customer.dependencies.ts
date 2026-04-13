import { CustomerController } from '../controllers/implementation/customerController';
import { CustomerRepository } from '../repositories/implementation/customerRepository';
import { CustomerService } from '../services/implementation/customerService';

const customerRepository = new CustomerRepository();
const customerService = new CustomerService(customerRepository);

export const customerController = new CustomerController(customerService);
