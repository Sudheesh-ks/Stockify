import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY!;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendOTP = async (email: string, otp: string) => {
  const emailData = new SibApiV3Sdk.SendSmtpEmail();

  emailData.subject = 'Verify your Account';
  emailData.sender = {
    name: 'Stockify',
    email: process.env.SENDER_EMAIL!,
  };
  emailData.to = [{ email }];

  emailData.htmlContent = `Your OTP is: <b>${otp}</b>`;

  try {
    await apiInstance.sendTransacEmail(emailData);
    console.log('OTP sent successfully');
  } catch (error: any) {
    console.error('Brevo error:', error.response?.body || error);
    throw new Error('Failed to send OTP');
  }
};
