import { userApi } from "../axios/axiosInstance";
import type { ProductTypes } from "../types/product";
import { PRODUCT_API } from "../constants/apiConstants";

export const createProductAPI = async (data: ProductTypes) => {
    const res = await userApi.post(PRODUCT_API.CREATE, data)
    return res.data.data;
}

export const getAllProductsAPI = async (search?: string, page?: number, limit?: number) => {
    const res = await userApi.get(PRODUCT_API.GET_ALL, { params: { search, page, limit } })
    return res.data.data; // Now returns { products, totalCount, totalPages, currentPage }
}

export const getProductByIdAPI = async (id: string) => {
    const res = await userApi.get(PRODUCT_API.GET_BY_ID(id))
    return res.data.data;
}

export const updateProductAPI = async (id: string, data: ProductTypes) => {
    const res = await userApi.put(PRODUCT_API.UPDATE(id), data)
    return res.data.data;
}

export const deleteProductAPI = async (id: string) => {
    const res = await userApi.delete(PRODUCT_API.DELETE(id))
    return res.data.data;
}