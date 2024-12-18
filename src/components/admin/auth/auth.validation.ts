import { Schema } from 'express-validator';
import {
  ADMIN_VALIDATION_EMAIL_EXIST,
  VALIDATION_ADMIN_PASSWORD,
  VALIDATION_ADMIN_PASSWORD_CHECK,
  VALIDATION_ADMIN_TYPE,
  VALIDATION_EMAIL_EXIST,
  VALIDATION_EMAIL_NOT_EXIST,
  VALIDATION_PASSWORD,
  VALIDATION_PASSWORD_CHECK,
  VALIDATION_PROMOTION,
  VALIDATION_STRING,
  VALIDATION_TOKEN,
  VALIDATION_USER_TYPE,
} from '../../../constants/validation';

export const REGISTER_SCHEMA: Schema = {
  password: VALIDATION_ADMIN_PASSWORD('body'),
  email: VALIDATION_STRING('body'),
};

export const EMAIL_VERIFY_SCHEMA: Schema = {
  email: VALIDATION_EMAIL_NOT_EXIST('body'),
};

export const ADMIN_LOGIN_SCHEMA: Schema = {
  email: ADMIN_VALIDATION_EMAIL_EXIST('body'),
  password: VALIDATION_ADMIN_PASSWORD_CHECK('body', 'email'),
};

export const FORGOT_PASSWORD_SCHEMA: Schema = {
  email: ADMIN_VALIDATION_EMAIL_EXIST('body'),
};

export const RESET_PASSWORD_SCHEMA: Schema = {
  password: VALIDATION_ADMIN_PASSWORD('body'),
  tokenId: VALIDATION_TOKEN('body'),
};

export const UPDATE_PASSWORD_SCHEMA: Schema = {
  currentPassword: VALIDATION_PASSWORD_CHECK('body', 'id'),
  newPassword: VALIDATION_ADMIN_PASSWORD('body'),
};

export const REFRESH_TOKEN_SCHEMA: Schema = {
  refreshToken: VALIDATION_STRING('body'),
};
