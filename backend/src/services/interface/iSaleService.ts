import { SaleDTO } from "../../dtos/sale.dto";

export interface ISaleService {
    recordSale(userId: string, productId: string, quantity: number, customerName?: string, date?: Date): Promise<SaleDTO>;
    getSales(userId: string, filters: { startDate?: Date, endDate?: Date, productId?: string, customerName?: string }, page?: number, limit?: number): Promise<{ sales: SaleDTO[], totalCount: number, totalPages: number, currentPage: number }>;
    getSalesByCustomer(userId: string, customerName: string): Promise<SaleDTO[]>;
    getItemsReport(userId: string, page: number, limit: number): Promise<{ data: any[], totalCount: number, totalPages: number, currentPage: number }>;
    getCustomerLedger(userId: string, page: number, limit: number): Promise<{ data: any[], totalCount: number, totalPages: number, currentPage: number }>;
    deleteSale(userId: string, id: string): Promise<void>;
}
