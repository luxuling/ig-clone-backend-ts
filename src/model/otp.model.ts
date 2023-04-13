import { Schema, model } from 'mongoose';
import { OtpType } from './type.model';

const OtpSchema = new Schema<OtpType>({
  userId: {
    type: String,
  },
  tokenOTP: {
    type: String,
  },
});

export const OTPdb = model('otpStore', OtpSchema);
