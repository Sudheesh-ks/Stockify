import { CustomerDTO } from '../../dtos/customer.dto';
import { toCustomerDTO } from '../../mappers/customer.mapper';
import { CustomerRepository } from '../../repositories/implementation/customerRepository';
import { ICustomerService } from '../interface/ICustomerService';

export class CustomerService implements ICustomerService {
  constructor(private readonly _customerRepository: CustomerRepository) {}

  async createCustomer(
    userId: string,
    customer: { name: string; address: string; mobile: string },
  ): Promise<CustomerDTO> {
    const created = await this._customerRepository.createCustomer({
      ...customer,
      userId: userId,
    });
    return toCustomerDTO(created);
  }

  async updateCustomer(
    id: string,
    userId: string,
    customer: { name?: string; address?: string; mobile?: string },
  ): Promise<CustomerDTO> {
    const updated = await this._customerRepository.updateCustomer(id, userId, customer);
    return toCustomerDTO(updated);
  }

  async deleteCustomer(id: string, userId: string): Promise<CustomerDTO> {
    const deleted = await this._customerRepository.deleteCustomer(id, userId);
    return toCustomerDTO(deleted);
  }

  async getCustomer(id: string, userId: string): Promise<CustomerDTO> {
    const customer = await this._customerRepository.getCustomer(id, userId);
    return toCustomerDTO(customer);
  }

  async getAllCustomers(
    userId: string,
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{
    customers: CustomerDTO[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    const { customers, totalCount } = await this._customerRepository.getAllCustomers(userId, search, page, limit);
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
