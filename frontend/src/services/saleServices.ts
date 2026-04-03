import { userApi } from "../axios/axiosInstance";
import { SALE_API } from "../constants/apiConstants";

export interface SaleFilters {
    startDate?: string;
    endDate?: string;
    productId?: string;
    customerName?: string;
    page?: number;
    limit?: number;
}

export const createSaleAPI = async (data: { productId: string, quantity: number, customerName?: string }) => {
    const res = await userApi.post(SALE_API.CREATE, data)
    return res.data.data;
}

export const getAllSalesAPI = async (filters: SaleFilters) => {
    const res = await userApi.get(SALE_API.GET_ALL, { params: filters })
    return res.data.data;
}

export const getSalesByCustomerAPI = async (name: string) => {
    const res = await userApi.get(SALE_API.GET_BY_CUSTOMER(name))
    return res.data.data;
}

export const getItemsReportAPI = async (page: number = 1, limit: number = 10) => {
    const res = await userApi.get(SALE_API.GET_ITEMS_REPORT, { params: { page, limit } })
    return res.data.data;
}

export const getCustomerLedgerAPI = async (page: number = 1, limit: number = 10) => {
    const res = await userApi.get(SALE_API.GET_LEDGER_REPORT, { params: { page, limit } })
    return res.data.data;
}
