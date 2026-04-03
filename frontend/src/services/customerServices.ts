import { userApi } from "../axios/axiosInstance";
import { CUSTOMER_API } from "../constants/apiConstants";
import type { CustomerTypes } from "../types/customer";

export const createCustomerAPI = async (data: CustomerTypes) => {
  const res = await userApi.post(CUSTOMER_API.CREATE, data);
  return res.data.data;
};

export const getAllCustomersAPI = async (
  search?: string,
  page?: number,
  limit?: number,
) => {
  const res = await userApi.get(CUSTOMER_API.GET_ALL, {
    params: { search, page, limit },
  });
  return res.data.data;
};

export const getCustomerByIdAPI = async (id: string) => {
  const res = await userApi.get(CUSTOMER_API.GET_BY_ID(id));
  return res.data.data;
};

export const updateCustomerAPI = async (
  id: string,
  data: Partial<CustomerTypes>,
) => {
  const res = await userApi.put(CUSTOMER_API.UPDATE(id), data);
  return res.data.data;
};

export const deleteCustomerAPI = async (id: string) => {
  const res = await userApi.delete(CUSTOMER_API.DELETE(id));
  return res.data.data;
};
