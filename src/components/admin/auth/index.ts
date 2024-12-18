import express from 'express';
import { checkSchema } from 'express-validator';

import { EMAIL_VERIFY_SCHEMA, REGISTER_SCHEMA } from './auth.validation';

import * as controller from './auth.controller';

import { checkValidation } from '../../../utils/validation';
import {
  FORGOT_PASSWORD_SCHEMA,
  REFRESH_TOKEN_SCHEMA,
  ADMIN_LOGIN_SCHEMA,
  RESET_PASSWORD_SCHEMA,
} from './auth.validation';
import { isAdmin, isAuthenticated } from '../../../utils/auth';
import {} from '../../user/auth/auth.validation';

const router = express.Router();

router.put('/login', checkSchema(ADMIN_LOGIN_SCHEMA), checkValidation, controller.login);
router.post('/password/forgot', checkSchema(FORGOT_PASSWORD_SCHEMA), checkValidation, controller.forgotPassword);
router.put('/password/reset', checkSchema(RESET_PASSWORD_SCHEMA), checkValidation, controller.resetPassword);
router.post('/refresh', checkSchema(REFRESH_TOKEN_SCHEMA), checkValidation, controller.refresh);
router.put('/logout', isAdmin, controller.logout);

export default router;
