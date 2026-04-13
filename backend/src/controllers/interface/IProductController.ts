import { Request, Response } from 'express';

export interface IProductController {
  createProduct(req: Request, res: Response): Promise<void>;
  getAllProducts(req: Request, res: Response): Promise<void>;
  getProduct(req: Request, res: Response): Promise<void>;
  updateProduct(req: Request, res: Response): Promise<void>;
  deleteProduct(req: Request, res: Response): Promise<void>;
}
