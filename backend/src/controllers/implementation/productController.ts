import { IProductService } from '../../services/interface/IProductService';
import { sendResponse } from '../../utils/apiResponse.util';
import { HttpStatus } from '../../constants/status.constants';
import { HttpResponse } from '../../constants/responseMessage.constants';
import { Request, Response } from 'express';
import { IProductController } from '../interface/IProductController';

export class ProductController implements IProductController {
  constructor(private readonly _productService: IProductService) {}

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, quantity, price } = req.body;
      const userId = (req as any).userId;
      const product = await this._productService.createProduct(userId, {
        name,
        description,
        quantity,
        price,
      });
      sendResponse(res, HttpStatus.CREATED, true, HttpResponse.PRODUCT_CREATED, product);
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        (error as Error).message || HttpResponse.SERVER_ERROR,
        null,
        error,
      );
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, quantity, price } = req.body;
      const id = req.params.id as string;
      const userId = (req as any).userId;
      const product = await this._productService.updateProduct(id, userId, {
        name,
        description,
        quantity,
        price,
      });
      sendResponse(res, HttpStatus.OK, true, HttpResponse.PRODUCT_UPDATED, product);
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        (error as Error).message || HttpResponse.SERVER_ERROR,
        null,
        error,
      );
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = (req as any).userId;
      const product = await this._productService.deleteProduct(id, userId);
      sendResponse(res, HttpStatus.OK, true, HttpResponse.PRODUCT_DELETED, product);
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        (error as Error).message || HttpResponse.SERVER_ERROR,
        null,
        error,
      );
    }
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = (req as any).userId;
      const product = await this._productService.getProduct(id, userId);
      sendResponse(res, HttpStatus.OK, true, HttpResponse.PRODUCT_FOUND, product);
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        (error as Error).message || HttpResponse.SERVER_ERROR,
        null,
        error,
      );
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const userId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const result = await this._productService.getAllProducts(userId, search, page, limit);
      sendResponse(res, HttpStatus.OK, true, HttpResponse.PRODUCTS_FOUND, result);
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        (error as Error).message || HttpResponse.SERVER_ERROR,
        null,
        error,
      );
    }
  }
}
