import { CustomerDTO } from "../dtos/customer.dto";
import { CustomerDocument } from "../models/customerModel";

export const toCustomerDTO = (customer: CustomerDocument): CustomerDTO => {
  return {
    _id: (customer._id as any).toString(),
    name: customer.name,
    address: customer.address,
    mobile: customer.mobile,
  };
};
