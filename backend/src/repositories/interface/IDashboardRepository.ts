import { Document, Types } from "mongoose";

export interface IDashboardRepository {
  getProductsCount(userId: string): Promise<number>;
  getCustomersCount(userId: string): Promise<number>;
  getSalesCount(userId: string): Promise<number>;
  getRecentProducts(userId: string): Promise<any[]>;
  getRecentCustomers(userId: string): Promise<any[]>;
  getRecentSales(userId: string): Promise<any[]>;
}
