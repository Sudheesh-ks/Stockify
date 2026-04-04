import customerModel, { CustomerDocument } from "../../models/customerModel";
import { BaseRepository } from "../baseRepository";
import { ICustomerRepository } from "../interface/ICustomerRepository";

export class CustomerRepository
  extends BaseRepository<CustomerDocument>
  implements ICustomerRepository
{
  constructor() {
    super(customerModel);
  }

  async createCustomer(
    customer: Partial<CustomerDocument>,
  ): Promise<CustomerDocument> {
    return this.create(customer);
  }

  async updateCustomer(
    id: string,
    userId: string,
    customer: Partial<CustomerDocument>,
  ): Promise<CustomerDocument> {
    const updated = await this.findOneAndUpdate({ _id: id, userId }, customer, {
      new: true,
    });
    if (!updated) throw new Error("Customer not found or unauthorized");
    return updated;
  }

  async deleteCustomer(id: string, userId: string): Promise<CustomerDocument> {
    const deleted = await this.model
      .findOneAndDelete({ _id: id, userId })
      .exec();
    if (!deleted) throw new Error("Customer not found or unauthorized");
    return deleted;
  }

  async getCustomer(id: string, userId: string): Promise<CustomerDocument> {
    const customer = await this.findOne({ _id: id, userId });
    if (!customer) throw new Error("Customer not found or unauthorized");
    return customer;
  }

  async getAllCustomers(
    userId: string,
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ customers: CustomerDocument[]; totalCount: number }> {
    const query: any = { userId };

    if (search) {
      query.$and = [
        { userId },
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
            { mobile: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    const totalCount = await this.countDocuments(query);
    let customersQuery = this.model.find(query);

    if (page && limit) {
      customersQuery = customersQuery.skip((page - 1) * limit).limit(limit);
    }

    const customers = await customersQuery.exec();
    return { customers, totalCount };
  }
}
