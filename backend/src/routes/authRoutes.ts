import express from 'express';
import { authController } from '../dependencyHandlers.ts/user.dependencies';

const authRouter = express.Router();

authRouter.post(
    '/register',
    authController.registerUser.bind(authController)
);

authRouter.post(
    '/verify-otp',
    authController.verifyOTP.bind(authController)
);

authRouter.post(
    '/resend-otp',
    authController.resendOtp.bind(authController)
);


export default authRouter;