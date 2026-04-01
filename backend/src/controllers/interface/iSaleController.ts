import { Request, Response } from "express";

export interface ISaleController {
    recordSale(req: Request, res: Response): Promise<void>;
    getSales(req: Request, res: Response): Promise<void>;
    getSalesByCustomer(req: Request, res: Response): Promise<void>;
}
