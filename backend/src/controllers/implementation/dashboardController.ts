import { Request, Response } from "express";
import { IDashboardController } from "../interface/IDashboardController";
import { IDashboardService } from "../../services/interface/IDashboardService";
import { sendResponse } from "../../utils/apiResponse.util";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";

export class DashboardController implements IDashboardController {
  constructor(private readonly _dashboardService: IDashboardService) {}

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const stats = await this._dashboardService.getDashboardStats(userId);
      sendResponse(
        res,
        HttpStatus.OK,
        true,
        "Dashboard stats retrieved successfully",
        stats,
      );
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
