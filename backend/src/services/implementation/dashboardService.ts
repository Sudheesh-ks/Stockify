import { IDashboardService } from '../interface/IDashboardService';
import { IDashboardRepository } from '../../repositories/interface/IDashboardRepository';

export class DashboardService implements IDashboardService {
  constructor(private readonly _dashboardRepository: IDashboardRepository) {}

  async getDashboardStats(userId: string): Promise<any> {
    const [productsCount, customersCount, salesCount, recentProducts, recentCustomers, recentSales] = await Promise.all(
      [
        this._dashboardRepository.getProductsCount(userId),
        this._dashboardRepository.getCustomersCount(userId),
        this._dashboardRepository.getSalesCount(userId),
        this._dashboardRepository.getRecentProducts(userId),
        this._dashboardRepository.getRecentCustomers(userId),
        this._dashboardRepository.getRecentSales(userId),
      ],
    );

    return {
      stats: {
        products: productsCount,
        customers: customersCount,
        sales: salesCount,
      },
      recent: {
        products: recentProducts,
        customers: recentCustomers,
        sales: recentSales,
      },
    };
  }
}
