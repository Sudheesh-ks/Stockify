import { IDashboardRepository } from '../interface/IDashboardRepository';
import productModel from '../../models/productsModel';
import customerModel from '../../models/customerModel';
import salesModel from '../../models/salesModel';

export class DashboardRepository implements IDashboardRepository {
  async getProductsCount(userId: string): Promise<number> {
    return await productModel.countDocuments({ userId });
  }

  async getCustomersCount(userId: string): Promise<number> {
    return await customerModel.countDocuments({ userId });
  }

  async getSalesCount(userId: string): Promise<number> {
    return await salesModel.countDocuments({ userId });
  }

  async getRecentProducts(userId: string): Promise<any[]> {
    return await productModel.find({ userId }).sort({ createdAt: -1 }).limit(3);
  }

  async getRecentCustomers(userId: string): Promise<any[]> {
    return await customerModel.find({ userId }).sort({ createdAt: -1 }).limit(3);
  }

  async getRecentSales(userId: string): Promise<any[]> {
    return await salesModel.find({ userId }).populate('items.productId').sort({ createdAt: -1 }).limit(3);
  }
}
