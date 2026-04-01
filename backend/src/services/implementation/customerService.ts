import { CustomerDTO } from "../../dtos/customer.dto";
import { toCustomerDTO } from "../../mappers/customer.mapper";
import { CustomerRepository } from "../../repositories/implementation/customerRepository";
import { ICustomerService } from "../interface/iCustomerService";

export class CustomerService implements ICustomerService {
    constructor(private readonly _customerRepository: CustomerRepository) {}

    async createCustomer(customer: {name: string, address: string, mobile: string}): Promise<CustomerDTO> {
        const created = await this._customerRepository.createCustomer(customer);
        return toCustomerDTO(created);
    }

    async updateCustomer(id: string, customer: {name?: string, address?: string, mobile?: string}): Promise<CustomerDTO> {
        const updated = await this._customerRepository.updateCustomer(id, customer);
        return toCustomerDTO(updated);
    }

    async deleteCustomer(id: string): Promise<CustomerDTO> {
        const deleted = await this._customerRepository.deleteCustomer(id);
        return toCustomerDTO(deleted);
    }

    async getCustomer(id: string): Promise<CustomerDTO> {
        const customer = await this._customerRepository.getCustomer(id);
        return toCustomerDTO(customer);
    }

    async getAllCustomers(search?: string, page?: number, limit?: number): Promise<{ customers: CustomerDTO[], totalCount: number, totalPages: number, currentPage: number }> {
        const { customers, totalCount } = await this._customerRepository.getAllCustomers(search, page, limit);
        const effectiveLimit = limit && limit > 0 ? limit : 10;
        const totalPages = Math.max(1, Math.ceil(totalCount / effectiveLimit));

        return {
            customers: customers.map(toCustomerDTO),
            totalCount,
            totalPages,
            currentPage: page || 1,
        };
    }
}
