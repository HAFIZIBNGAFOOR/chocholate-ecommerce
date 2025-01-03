import express from 'express';
import { checkSchema } from 'express-validator';

import * as controller from './auth.controller';

import { checkValidation } from '../../../utils/validation';
import { isAuthenticated } from '../../../utils/auth';
import { VERIFY_OTP_SCHEMA } from './auth.validation';

router.put('/login', checkValidation, controller.login);

router.put('/login', checkValidation, controller.login);
router.put('/logout', isAuthenticated, controller.logout);
router.post('/verify-otp', checkSchema(VERIFY_OTP_SCHEMA), checkValidation, controller.verifyOtp);

// router.post('/password/forgot', checkSchema(FORGOT_PASSWORD_SCHEMA), checkValidation, controller.forgotPassword);
// router.put('/password/reset', checkSchema(RESET_PASSWORD_SCHEMA), checkValidation, controller.resetPassword);
router.post('/refresh', checkValidation, controller.refresh);

export default router;
