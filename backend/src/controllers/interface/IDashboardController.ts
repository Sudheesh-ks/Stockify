import { Request, Response } from 'express';

export interface IDashboardController {
  getDashboardStats(req: Request, res: Response): Promise<void>;
}
