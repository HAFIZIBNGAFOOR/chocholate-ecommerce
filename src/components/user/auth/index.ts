import express from 'express';
import { checkSchema } from 'express-validator';

import {
  FORGOT_PASSWORD_SCHEMA,
  LOGIN_SCHEMA,
  REFRESH_TOKEN_SCHEMA,
  RESET_PASSWORD_SCHEMA,
  UPDATE_PASSWORD_SCHEMA,
} from './auth.validation';

import * as controller from './auth.controller';

import { checkValidation } from '../../../utils/validation';
import { isAuthenticated } from '../../../utils/auth';

const router = express.Router();

router.put('/login', checkSchema(LOGIN_SCHEMA), checkValidation, controller.login);
router.put('/logout', isAuthenticated, controller.logout);
router.post('/password/forgot', checkSchema(FORGOT_PASSWORD_SCHEMA), checkValidation, controller.forgotPassword);
router.put('/password/reset', checkSchema(RESET_PASSWORD_SCHEMA), checkValidation, controller.resetPassword);
router.post('/refresh', checkSchema(REFRESH_TOKEN_SCHEMA), checkValidation, controller.refresh);

export default router;
