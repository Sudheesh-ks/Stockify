import { SaleDocument } from "../../models/salesModel";

export interface ISaleRepository {
    createSale(userId: string, sale: Partial<SaleDocument>): Promise<SaleDocument>;
    getAllSales(userId: string, filter?: any, page?: number, limit?: number): Promise<{ sales: SaleDocument[], totalCount: number }>;
    getSalesByCustomer(userId: string, customerName: string): Promise<SaleDocument[]>;
    getItemsReport(userId: string, page: number, limit: number): Promise<{ data: any[], totalCount: number }>;
    getCustomerLedger(userId: string, page: number, limit: number): Promise<{ data: any[], totalCount: number }>;
    deleteSale(id: string): Promise<void>;
}
