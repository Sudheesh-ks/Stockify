import { CustomerDocument } from "../../models/customerModel";

export interface ICustomerRepository {
    createCustomer(customer: Partial<CustomerDocument>): Promise<CustomerDocument>;
    updateCustomer(id: string, customer: Partial<CustomerDocument>): Promise<CustomerDocument>;
    deleteCustomer(id: string): Promise<CustomerDocument>;
    getCustomer(id: string): Promise<CustomerDocument>;
    getAllCustomers(search?: string, page?: number, limit?: number): Promise<{ customers: CustomerDocument[], totalCount: number }>;
}
