import { SaleDTO } from "../../dtos/sale.dto";
import { toSaleDTO } from "../../mappers/sale.mapper";
import { ProductRepository } from "../../repositories/implementation/productRepository";
import { SaleRepository } from "../../repositories/implementation/saleRepository";
import { ISaleService } from "../interface/iSaleService";

export class SaleService implements ISaleService {
    constructor(
        private readonly _saleRepository: SaleRepository,
        private readonly _productRepository: ProductRepository
    ) {}

    async recordSale(userId: string, productId: string, quantity: number, customerName: string = "Cash", date: Date = new Date()): Promise<SaleDTO> {
        // 1. Fetch product
        const product = await this._productRepository.getProduct(productId, userId);

        // 2. Validate stock
        if (product.quantity < quantity) {
            throw new Error("Insufficient stock");
        }

        // 3. Calculate total
        const totalAmount = quantity * product.price;

        // 4. Create sale record
        const sale = await this._saleRepository.createSale(userId, {
            productId: product._id,
            quantity,
            price: product.price,
            totalAmount,
            customerName,
            date: date || new Date()
        });

        // 5. Reduce product stock
        await this._productRepository.updateProduct(productId, userId, {
            quantity: product.quantity - quantity
        } as any);

        // 6. Return DTO (Need to populate product for the name in the DTO)
        const populatedSale = await this._saleRepository.getAllSales(userId, { _id: sale._id }, 1, 1);
        return toSaleDTO(populatedSale.sales[0]);
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
}
