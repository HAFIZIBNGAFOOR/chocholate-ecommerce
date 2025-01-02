import { Schema } from 'express-validator';
import {
  VALIDATION_EMAIL_EXIST,
  VALIDATION_EMAIL_EXIST_USER_TYPE,
  VALIDATION_PASSWORD,
  VALIDATION_PASSWORD_CHECK,
  VALIDATION_STRING,
  VALIDATION_TOKEN,
  VALIDATION_USER_TYPE,
} from '../../../constants/validation';


export const LOGIN_SCHEMA: Schema = {
  userType: VALIDATION_USER_TYPE('body'),
  email: VALIDATION_EMAIL_EXIST('body'),
};

export const FORGOT_PASSWORD_SCHEMA: Schema = {
  email: VALIDATION_EMAIL_EXIST_USER_TYPE('body'),
  userType: VALIDATION_USER_TYPE('body'),
};

export const RESET_PASSWORD_SCHEMA: Schema = {
  tokenId: VALIDATION_TOKEN('body'),
  password: VALIDATION_PASSWORD('body', 'token'),
};

export const UPDATE_PASSWORD_SCHEMA: Schema = {
  currentPassword: VALIDATION_PASSWORD_CHECK('body', 'id'),
  newPassword: VALIDATION_PASSWORD('body', 'user'),
};

export const REFRESH_TOKEN_SCHEMA: Schema = {
  refreshToken: VALIDATION_STRING('body'),
};
