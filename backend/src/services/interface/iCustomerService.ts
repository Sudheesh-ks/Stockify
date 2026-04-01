import { CustomerDTO } from "../../dtos/customer.dto";

export interface ICustomerService {
    createCustomer(customer: {name: string, address: string, mobile: string}): Promise<CustomerDTO>;
    updateCustomer(id: string, customer: {name?: string, address?: string, mobile?: string}): Promise<CustomerDTO>;
    deleteCustomer(id: string): Promise<CustomerDTO>;
    getCustomer(id: string): Promise<CustomerDTO>;
    getAllCustomers(search?: string, page?: number, limit?: number): Promise<{ customers: CustomerDTO[], totalCount: number, totalPages: number, currentPage: number }>;
}
