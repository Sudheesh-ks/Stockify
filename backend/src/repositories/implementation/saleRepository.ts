import salesModel, { SaleDocument } from "../../models/salesModel";
import { BaseRepository } from "../baseRepository";
import { ISaleRepository } from "../interface/iSaleRepository";

export class SaleRepository extends BaseRepository<SaleDocument> implements ISaleRepository {
    constructor() {
        super(salesModel);
    }

    async createSale(userId: string, sale: Partial<SaleDocument>): Promise<SaleDocument> {
        return this.create({ ...sale, userId: userId as any });
    }

    async getAllSales(userId: string, filter: any = {}, page: number = 1, limit: number = 5): Promise<{ sales: SaleDocument[], totalCount: number }> {
        const query = { ...filter, userId };
        const totalCount = await this.countDocuments(query);
        
        const sales = await this.model.find(query)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('productId')
            .exec();

        return { sales, totalCount };
    }

    async getSalesByCustomer(userId: string, customerName: string): Promise<SaleDocument[]> {
        return this.model.find({ 
            userId,
            customerName: { $regex: customerName, $options: 'i' } 
        })
            .sort({ date: -1 })
            .populate('productId')
            .exec();
    }
}
