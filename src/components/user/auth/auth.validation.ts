import { Schema } from 'express-validator';
import { VALIDATION_EMAIL, VALIDATION_EMAIL_OTP, VALIDATION_OTP, VALIDATION_USER_TYPE } from '../../../constants/validation';

export const VERIFY_OTP_SCHEMA: Schema = {
  email: VALIDATION_EMAIL_OTP('body'),
  otp: VALIDATION_OTP('body'),
};

// export const FORGOT_PASSWORD_SCHEMA: Schema = {
//   email: VALIDATION_EMAIL_EXIST_USER_TYPE('body'),
//   userType: VALIDATION_USER_TYPE('body'),
// };

// export const RESET_PASSWORD_SCHEMA: Schema = {
//   tokenId: VALIDATION_TOKEN('body'),
//   password: VALIDATION_PASSWORD('body', 'token'),
// };

// export const UPDATE_PASSWORD_SCHEMA: Schema = {
//   currentPassword: VALIDATION_PASSWORD_CHECK('body', 'id'),
//   newPassword: VALIDATION_PASSWORD('body', 'user'),
// };

export const LOGIN_SCHEMA: Schema = {
  email: VALIDATION_EMAIL('body'),
  userType: VALIDATION_USER_TYPE('body'),
};
