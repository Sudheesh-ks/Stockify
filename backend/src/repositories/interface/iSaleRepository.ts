import { SaleDocument } from "../../models/salesModel";

export interface ISaleRepository {
    createSale(userId: string, sale: Partial<SaleDocument>): Promise<SaleDocument>;
    getAllSales(userId: string, filter?: any, page?: number, limit?: number): Promise<{ sales: SaleDocument[], totalCount: number }>;
    getSalesByCustomer(userId: string, customerName: string): Promise<SaleDocument[]>;
}
