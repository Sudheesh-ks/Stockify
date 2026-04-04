export interface IDashboardService {
  getDashboardStats(userId: string): Promise<any>;
}
