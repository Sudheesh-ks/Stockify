import { ISaleController } from "../interface/iSaleController";
import { ISaleService } from "../../services/interface/iSaleService";
import { sendResponse } from "../../utils/apiResponse.util";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { Request, Response } from "express";

export class SaleController implements ISaleController {
    constructor(private readonly _saleService: ISaleService) {}

    async recordSale(req: Request, res: Response): Promise<void> {
        try {
            const { productId, quantity, customerName } = req.body;
            const userId = (req as any).userId;
            const sale = await this._saleService.recordSale(userId, productId, quantity, customerName);
            sendResponse(res, HttpStatus.CREATED, true, HttpResponse.CREATED, sale);
        } catch (error) {
            sendResponse(res, HttpStatus.BAD_REQUEST, false, (error as Error).message || HttpResponse.SERVER_ERROR, null, error);
        }
    }

    async getSales(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;
            const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
            const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
            const productId = req.query.productId as string | undefined;
            const customerName = req.query.customerName as string | undefined;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this._saleService.getSales(userId, { startDate, endDate, productId, customerName }, page, limit);
            sendResponse(res, HttpStatus.OK, true, HttpResponse.OK, result);
        } catch (error) {
            sendResponse(res, HttpStatus.BAD_REQUEST, false, (error as Error).message || HttpResponse.SERVER_ERROR, null, error);
        }
    }

    async getSalesByCustomer(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;
            const customerName = req.params.name as string;
            const result = await this._saleService.getSalesByCustomer(userId, customerName);
            sendResponse(res, HttpStatus.OK, true, HttpResponse.OK, result);
        } catch (error) {
            sendResponse(res, HttpStatus.BAD_REQUEST, false, (error as Error).message || HttpResponse.SERVER_ERROR, null, error);
        }
    }
}
