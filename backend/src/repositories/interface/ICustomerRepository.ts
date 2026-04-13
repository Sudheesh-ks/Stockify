import { CustomerDocument } from '../../models/customerModel';

export interface ICustomerRepository {
  createCustomer(customer: Partial<CustomerDocument>): Promise<CustomerDocument>;
  updateCustomer(id: string, userId: string, customer: Partial<CustomerDocument>): Promise<CustomerDocument>;
  deleteCustomer(id: string, userId: string): Promise<CustomerDocument>;
  getCustomer(id: string, userId: string): Promise<CustomerDocument>;
  getAllCustomers(
    userId: string,
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ customers: CustomerDocument[]; totalCount: number }>;
}
