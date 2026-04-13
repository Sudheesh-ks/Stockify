import { DashboardController } from '../controllers/implementation/dashboardController';
import { DashboardRepository } from '../repositories/implementation/dashboardRepository';
import { DashboardService } from '../services/implementation/dashboardService';

const dashboardRepository = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepository);

export const dashboardController = new DashboardController(dashboardService);
