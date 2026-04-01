import { SaleDTO } from "../../dtos/sale.dto";

export interface ISaleService {
    recordSale(productId: string, quantity: number, customerName?: string): Promise<SaleDTO>;
    getSales(filters: { startDate?: Date, endDate?: Date, productId?: string, customerName?: string }, page?: number, limit?: number): Promise<{ sales: SaleDTO[], totalCount: number, totalPages: number, currentPage: number }>;
    getSalesByCustomer(customerName: string): Promise<SaleDTO[]>;
}
