import { Request, Response } from "express";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { sendResponse } from "../../utils/apiResponse.util";
import { AuthPurpose } from "../../constants/authPurpose.constants";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.util";
import { IAuthController } from "../interface/IAuthController";
import { IAuthService } from "../../services/interface/IAuthService";

export class AuthController implements IAuthController {
  constructor(private readonly _authService: IAuthService) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    const { email, username, shopname, password } = req.body;

    try {
      await this._authService.registerUser({
        email,
        username,
        shopname,
        password,
      });
      sendResponse(res, HttpStatus.OK, true, HttpResponse.OTP_SENT);
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

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, purpose } = req.body;
      const result = await this._authService.verifyOtp(email, otp, purpose);

      if (purpose === AuthPurpose.REGISTER && result.user) {
        const accessToken = generateAccessToken(
          result.user._id!,
          result.user.email,
        );
        const refreshToken = generateRefreshToken(
          result.user._id!,
          result.user.email,
        );

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        sendResponse(res, HttpStatus.OK, true, HttpResponse.REGISTER_SUCCESS, {
          accessToken,
          user: result.user,
        });
        return;
      }

      if (purpose === AuthPurpose.RESET_PASSWORD) {
        sendResponse(res, HttpStatus.OK, true, HttpResponse.OTP_VERIFIED, {
          purpose: AuthPurpose.RESET_PASSWORD,
        });
        return;
      }

      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        HttpResponse.BAD_REQUEST,
      );
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        (error as Error).message,
      );
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      await this._authService.resendOtp(email);

      sendResponse(res, HttpStatus.OK, true, HttpResponse.OTP_RESENT);
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        (error as Error).message || HttpResponse.OTP_SEND_FAILED,
        null,
        error,
      );
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const { user } = await this._authService.loginUser(email, password);

      const accessToken = generateAccessToken(user._id!, user.email);
      const refreshToken = generateRefreshToken(user._id!, user.email);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendResponse(res, HttpStatus.OK, true, HttpResponse.LOGIN_SUCCESS, {
        accessToken,
        user,
      });
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

  async forgotPasswordRequest(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    try {
      await this._authService.forgotPasswordRequest(email);
      sendResponse(res, HttpStatus.OK, true, HttpResponse.OTP_SENT);
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

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { email, newPassword } = req.body;

    try {
      await this._authService.resetPassword(email, newPassword);
      sendResponse(res, HttpStatus.OK, true, HttpResponse.PASSWORD_UPDATED);
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

  async logoutUser(req: Request, res: Response): Promise<void> {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    sendResponse(res, HttpStatus.OK, true, HttpResponse.LOGOUT_SUCCESS);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.refreshToken;

      if (!token) {
        sendResponse(
          res,
          HttpStatus.UNAUTHORIZED,
          false,
          HttpResponse.REFRESH_TOKEN_MISSING,
        );
        return;
      }

      const decoded = verifyRefreshToken(token);
      const user = await this._authService.getUserById(decoded.id);

      if (!user) {
        sendResponse(
          res,
          HttpStatus.UNAUTHORIZED,
          false,
          HttpResponse.USER_NOT_FOUND,
        );
        return;
      }

      const newAccessToken = generateAccessToken(user._id!, user.email);

      sendResponse(res, HttpStatus.OK, true, HttpResponse.OK, {
        accessToken: newAccessToken,
        user: user,
      });
    } catch (error: any) {
      sendResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        false,
        error.message,
        null,
        error,
      );
    }
  }
}
