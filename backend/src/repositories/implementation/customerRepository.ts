import customerModel, { CustomerDocument } from "../../models/customerModel";
import { BaseRepository } from "../baseRepository";
import { ICustomerRepository } from "../interface/iCustomerRepository";

export class CustomerRepository extends BaseRepository<CustomerDocument> implements ICustomerRepository {
    constructor() {
        super(customerModel);
    }

    async createCustomer(customer: Partial<CustomerDocument>): Promise<CustomerDocument> {
        return this.create(customer);
    }

    async updateCustomer(id: string, customer: Partial<CustomerDocument>): Promise<CustomerDocument> {
        const updated = await this.updateById(id, customer);
        if (!updated) throw new Error("Customer not found");
        return updated;
    }

    async deleteCustomer(id: string): Promise<CustomerDocument> {
        const deleted = await this.deleteById(id);
        if (!deleted) throw new Error("Customer not found");
        return deleted;
    }

    async getCustomer(id: string): Promise<CustomerDocument> {
        const customer = await this.findById(id);
        if (!customer) throw new Error("Customer not found");
        return customer;
    }

    async getAllCustomers(search?: string, page?: number, limit?: number): Promise<{ customers: CustomerDocument[], totalCount: number }> {
        const query = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { address: { $regex: search, $options: "i" } },
                      { mobile: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

        const totalCount = await this.countDocuments(query);
        let customersQuery = this.model.find(query);

        if (page && limit) {
            customersQuery = customersQuery.skip((page - 1) * limit).limit(limit);
        }

        const customers = await customersQuery.exec();
        return { customers, totalCount };
    }
}
