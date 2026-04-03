import { ICustomerService } from "../../services/interface/iCustomerService";
import { sendResponse } from "../../utils/apiResponse.util";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { Request, Response } from "express";
import { ICustomerController } from "../interface/iCustomerController";

export class CustomerController implements ICustomerController {
  constructor(private readonly _customerService: ICustomerService) {}

  async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { name, address, mobile } = req.body;
      const userId = (req as any).userId;
      const customer = await this._customerService.createCustomer(userId, {
        name,
        address,
        mobile,
      });
      sendResponse(
        res,
        HttpStatus.CREATED,
        true,
        HttpResponse.CUSTOMER_CREATED,
        customer,
      );
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        (error as Error).message,
        null,
        error,
      );
    }
  }

  async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { name, address, mobile } = req.body;
      const id = req.params.id as string;
      const userId = (req as any).userId;
      const customer = await this._customerService.updateCustomer(id, userId, {
        name,
        address,
        mobile,
      });
      sendResponse(
        res,
        HttpStatus.OK,
        true,
        HttpResponse.CUSTOMER_UPDATED,
        customer,
      );
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        (error as Error).message,
        null,
        error,
      );
    }
  }

  async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = (req as any).userId;
      const customer = await this._customerService.deleteCustomer(id, userId);
      sendResponse(
        res,
        HttpStatus.OK,
        true,
        HttpResponse.CUSTOMER_DELETED,
        customer,
      );
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        (error as Error).message,
        null,
        error,
      );
    }
  }

  async getCustomer(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = (req as any).userId;
      const customer = await this._customerService.getCustomer(id, userId);
      sendResponse(
        res,
        HttpStatus.OK,
        true,
        HttpResponse.CUSTOMER_FOUND,
        customer,
      );
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        (error as Error).message,
        null,
        error,
      );
    }
  }

  async getAllCustomers(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const userId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const result = await this._customerService.getAllCustomers(
        userId,
        search,
        page,
        limit,
      );
      sendResponse(
        res,
        HttpStatus.OK,
        true,
        HttpResponse.CUSTOMERS_FOUND,
        result,
      );
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        (error as Error).message,
        null,
        error,
      );
    }
  }
}
