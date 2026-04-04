import express from "express";
import { saleController } from "../dependencyHandlers.ts/sale.dependencies";
import authMiddleware from "../middlewares/authMiddleware";

const saleRouter = express.Router();

saleRouter.post(
  "/",
  authMiddleware(),
  saleController.recordSale.bind(saleController),
);
saleRouter.get(
  "/",
  authMiddleware(),
  saleController.getSales.bind(saleController),
);
saleRouter.get(
  "/customer/:name",
  authMiddleware(),
  saleController.getSalesByCustomer.bind(saleController),
);
saleRouter.get(
  "/reports/items",
  authMiddleware(),
  saleController.getItemsReport.bind(saleController),
);
saleRouter.get(
  "/reports/ledger",
  authMiddleware(),
  saleController.getCustomerLedger.bind(saleController),
);
saleRouter.delete(
  "/:id",
  authMiddleware(),
  saleController.deleteSale.bind(saleController),
);

export default saleRouter;
