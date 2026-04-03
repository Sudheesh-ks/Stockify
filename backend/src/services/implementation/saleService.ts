import { SaleDTO } from "../../dtos/sale.dto";
import { toSaleDTO } from "../../mappers/sale.mapper";
import { ProductRepository } from "../../repositories/implementation/productRepository";
import { SaleRepository } from "../../repositories/implementation/saleRepository";
import { ISaleService } from "../interface/ISaleService";

export class SaleService implements ISaleService {
    constructor(
        private readonly _saleRepository: SaleRepository,
        private readonly _productRepository: ProductRepository
    ) {}

    async recordSale(userId: string, items: { productId: string, quantity: number }[], customerName: string = "Cash", date: Date = new Date()): Promise<SaleDTO> {
        let totalAmount = 0;
        const saleItems = [];

        // 1. Validate all products and stock first
        for (const item of items) {
            const product = await this._productRepository.getProduct(item.productId, userId);
            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }
            
            const itemTotal = item.quantity * product.price;
            totalAmount += itemTotal;
            
            saleItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // 2. Create the unified sale record
        const sale = await this._saleRepository.createSale(userId, {
            items: saleItems as any,
            totalAmount,
            customerName,
            date: date || new Date()
        });

        // 3. Reduce stock for each product
        for (const item of saleItems) {
            const product = await this._productRepository.getProduct(item.productId.toString(), userId);
            await this._productRepository.updateProduct(item.productId.toString(), userId, {
                quantity: product.quantity - item.quantity
            } as any);
        }

        // 4. Return DTO (Refetch to ensure population)
        const populatedSale = await this._saleRepository.findOne({ _id: sale._id, userId: userId as any });
        return toSaleDTO(populatedSale!);
    }

    async getSales(userId: string, filters: { startDate?: Date, endDate?: Date, productId?: string, customerName?: string }, page: number = 1, limit: number = 5): Promise<{ sales: SaleDTO[], totalCount: number, totalPages: number, currentPage: number }> {
        const query: any = {};

        if (filters.productId) {
            query.productId = filters.productId;
        }

        if (filters.customerName) {
            query.customerName = { $regex: filters.customerName, $options: 'i' };
        }

        if (filters.startDate || filters.endDate) {
            query.date = {};
            if (filters.startDate) query.date.$gte = new Date(filters.startDate);
            if (filters.endDate) query.date.$lte = new Date(filters.endDate);
        }

        const { sales, totalCount } = await this._saleRepository.getAllSales(userId, query, page, limit);
        const effectiveLimit = limit && limit > 0 ? limit : 5;
        const totalPages = Math.max(1, Math.ceil(totalCount / effectiveLimit));

        return {
            sales: sales.map(toSaleDTO),
            totalCount,
            totalPages,
            currentPage: page || 1
        };
    }

    async getSalesByCustomer(userId: string, customerName: string): Promise<SaleDTO[]> {
        const sales = await this._saleRepository.getSalesByCustomer(userId, customerName);
        return sales.map(toSaleDTO);
    }

    async getItemsReport(userId: string, page: number = 1, limit: number = 10): Promise<{ data: any[], totalCount: number, totalPages: number, currentPage: number }> {
        const { data, totalCount } = await this._saleRepository.getItemsReport(userId, page, limit);
        const totalPages = Math.ceil(totalCount / limit);
        return { data, totalCount, totalPages, currentPage: page };
    }

    async getCustomerLedger(userId: string, page: number = 1, limit: number = 10): Promise<{ data: any[], totalCount: number, totalPages: number, currentPage: number }> {
        const { data, totalCount } = await this._saleRepository.getCustomerLedger(userId, page, limit);
        const totalPages = Math.ceil(totalCount / limit);
        return { data, totalCount, totalPages, currentPage: page };
    }

    async deleteSale(userId: any, id: string): Promise<void> {
        const currentUserId = userId.toString();

        // 1. Fetch sale (Verify ownership in the query itself)
        const sale = await this._saleRepository.findOne({ _id: id, userId: userId as any });
        
        if (!sale) {
            console.error(`Sale deletion failed: Sale not found or unauthorized. ID: ${id}, userId: ${currentUserId}`);
            throw new Error("Sale not found or unauthorized");
        }

        // 2. Restore stock for each item
        for (const item of sale.items) {
            const product = await this._productRepository.getProduct(item.productId.toString(), currentUserId);
            await this._productRepository.updateProduct(item.productId.toString(), currentUserId, {
                quantity: (product.quantity || 0) + (item.quantity || 0)
            } as any);
        }

        // 3. Delete the sale record
        await this._saleRepository.deleteSale(id);
    }
}
