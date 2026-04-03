import { CustomerDTO } from "../../dtos/customer.dto";

export interface ICustomerService {
    createCustomer(userId: string, customer: {name: string, address: string, mobile: string}): Promise<CustomerDTO>;
    updateCustomer(id: string, userId: string, customer: {name?: string, address?: string, mobile?: string}): Promise<CustomerDTO>;
    deleteCustomer(id: string, userId: string): Promise<CustomerDTO>;
    getCustomer(id: string, userId: string): Promise<CustomerDTO>;
    getAllCustomers(userId: string, search?: string, page?: number, limit?: number): Promise<{ customers: CustomerDTO[], totalCount: number, totalPages: number, currentPage: number }>;
}
