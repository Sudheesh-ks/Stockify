import salesModel, { SaleDocument } from "../../models/salesModel";
import { BaseRepository } from "../baseRepository";
import { ISaleRepository } from "../interface/iSaleRepository";

export class SaleRepository extends BaseRepository<SaleDocument> implements ISaleRepository {
    constructor() {
        super(salesModel);
    }

    async createSale(sale: Partial<SaleDocument>): Promise<SaleDocument> {
        return this.create(sale);
    }

    async getAllSales(filter: any = {}, page: number = 1, limit: number = 5): Promise<{ sales: SaleDocument[], totalCount: number }> {
        const totalCount = await this.countDocuments(filter);
        
        const sales = await this.model.find(filter)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('productId')
            .exec();

        return { sales, totalCount };
    }

    async getSalesByCustomer(customerName: string): Promise<SaleDocument[]> {
        return this.model.find({ customerName: { $regex: customerName, $options: 'i' } })
            .sort({ date: -1 })
            .populate('productId')
            .exec();
    }
}
