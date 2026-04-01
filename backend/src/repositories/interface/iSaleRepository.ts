import { SaleDocument } from "../../../models/salesModel";

export interface ISaleRepository {
    createSale(sale: Partial<SaleDocument>): Promise<SaleDocument>;
    getAllSales(filter?: any, page?: number, limit?: number): Promise<{ sales: SaleDocument[], totalCount: number }>;
    getSalesByCustomer(customerName: string): Promise<SaleDocument[]>;
}
