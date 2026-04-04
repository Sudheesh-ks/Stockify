import { Router } from "express";
import { dashboardController } from "../dependencyHandlers.ts/dashboard.dependencies";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get(
  "/stats",
  authMiddleware(),
  dashboardController.getDashboardStats.bind(dashboardController),
);

export default router;
