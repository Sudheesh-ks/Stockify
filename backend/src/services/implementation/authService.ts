import { AuthPurpose } from "../../constants/authPurpose.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { UserDTO } from "../../dtos/user.dto";
import { toUserDTO } from "../../mappers/user.mapper";
import { userDocument } from "../../models/userModel";
import { IAuthRepository } from "../../repositories/interface/iAuthRepository";
import { IOtpRepository } from "../../repositories/interface/iOtpRepository";
import { sendOTP } from "../../utils/mail.util";
import { generateOTP } from "../../utils/otp.util";
import {
  isValidEmail,
  isValidPassword,
  isValidShopname,
  isValidUsername,
} from "../../utils/validation.util";
import bcrypt from "bcrypt";
import { IAuthService } from "../interface/iAuthService";

export class AuthService implements IAuthService {
  constructor(
    private readonly _authRepository: IAuthRepository,
    private readonly _otpRepository: IOtpRepository,
  ) {}

  async registerUser(data: {
    email: string;
    username: string;
    shopname: string;
    password: string;
  }): Promise<void> {
    const { email, username, shopname, password } = data;
    if (!email || !username || !shopname || !password) {
      throw new Error(HttpResponse.FIELDS_REQUIRED);
    }
    if (!isValidEmail(email)) {
      throw new Error(HttpResponse.INVALID_EMAIL);
    }
    if (!isValidPassword(password)) {
      throw new Error(HttpResponse.INVALID_PASSWORD);
    }
    if (!isValidUsername(username)) {
      throw new Error(HttpResponse.INVALID_USERNAME);
    }
    if (!isValidShopname(shopname)) {
      throw new Error(HttpResponse.INVALID_SHOPNAME);
    }

    const existing = await this._authRepository.findUserByEmail(email);
    if (existing) throw new Error(HttpResponse.EMAIL_ALREADY_EXISTS);

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    console.log("Generated OTP:", otp);
    await this._otpRepository.storeOtp(email, {
      otp,
      purpose: AuthPurpose.REGISTER,
      userData: { email, username, shopname, password: hashed },
    });
    sendOTP(email, otp).catch((err) => console.error("OTP send failed:", err));
  }

  async verifyOtp(
    email: string,
    otp: string,
    purpose: AuthPurpose,
  ): Promise<{ purpose: string; user?: UserDTO }> {
    const record = await this._otpRepository.getOtp(email, otp, purpose);
    if (!record) throw new Error(HttpResponse.OTP_INVALID);

    if (
      purpose === AuthPurpose.REGISTER &&
      record.userData &&
      record.userData.email &&
      record.userData.username &&
      record.userData.shopname &&
      record.userData.password
    ) {
      const newUser = await this.finalizeRegister({
        email: record.userData.email,
        username: record.userData.username,
        shopname: record.userData.shopname,
        password: record.userData.password,
      });
      await this._otpRepository.deleteOtp(email);
      return { purpose, user: newUser };
    }

    if (purpose === AuthPurpose.RESET_PASSWORD) {
      await this._otpRepository.storeOtp(email, { otp: "VERIFIED", purpose });
      return { purpose };
    }

    throw new Error(HttpResponse.BAD_REQUEST);
  }

  async finalizeRegister(userData: {
    email: string;
    username: string;
    shopname: string;
    password: string;
  }): Promise<UserDTO> {
    const newUser = (await this._authRepository.createUser(
      userData,
    )) as userDocument;
    return toUserDTO(newUser);
  }

  async resendOtp(email: string): Promise<void> {
    const oldRecord = await this._otpRepository.getOtp(email);

    if (!oldRecord) {
      throw new Error(HttpResponse.OTP_NOT_FOUND);
    }

    const newOtp = generateOTP();
    console.log("Generated new OTP:", newOtp);

    const updatedRecord = {
      otp: newOtp,
      purpose: oldRecord.purpose,
      userData: oldRecord.userData,
    };

    await this._otpRepository.storeOtp(email, updatedRecord);
    sendOTP(email, newOtp).catch((err) =>
      console.error("OTP resend failed:", err),
    );
  }

  async forgotPasswordRequest(email: string): Promise<void> {
    if (!email) {
      throw new Error(HttpResponse.FIELDS_REQUIRED);
    }
    if (!isValidEmail(email)) {
      throw new Error(HttpResponse.INVALID_EMAIL);
    }

    const userExists = await this._authRepository.findUserByEmail(email);
    if (!userExists) {
      throw new Error(HttpResponse.USER_NOT_FOUND);
    }

    const otp = generateOTP();
    console.log("Generated OTP for password reset:", otp);
    await this._otpRepository.storeOtp(email, {
      otp,
      purpose: AuthPurpose.RESET_PASSWORD,
    });
    sendOTP(email, otp).catch((err) => console.error("OTP send failed:", err));
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    if (!email || !newPassword) {
      throw new Error(HttpResponse.FIELDS_REQUIRED);
    }
    if (!isValidEmail(email)) {
      throw new Error(HttpResponse.INVALID_EMAIL);
    }
    if (!isValidPassword(newPassword)) {
      throw new Error(HttpResponse.INVALID_PASSWORD);
    }

    const record = await this._otpRepository.findOtpByEmail(email);
    if (!record || record.purpose !== AuthPurpose.RESET_PASSWORD || record.otp !== "VERIFIED") {
      throw new Error(HttpResponse.OTP_EXPIRED_OR_INVALID);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await this._authRepository.updatePasswordByEmail(email, hashedPassword);

    if (!updated) {
      throw new Error(HttpResponse.USER_NOT_FOUND);
    }

    await this._otpRepository.deleteOtp(email);
  }

  async loginUser(email: string, password: string): Promise<{ user: UserDTO }> {
    const user = await this._authRepository.findUserByEmail(email);
    if (!user) throw new Error(HttpResponse.INVALID_CREDENTIALS);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error(HttpResponse.INCORRECT_PASSWORD);
    return { user: toUserDTO(user) };
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async getUserById(id: string): Promise<UserDTO | null> {
    const user = await this._authRepository.findUserById(id);
    if (!user) return null;
    return toUserDTO(user);
  }
}
