import express from 'express';
import { checkSchema } from 'express-validator';
import { checkValidation } from '../../../utils/validation';
import * as controller from './utils.controller';

const router = express.Router();

router.put('/s3/signedURL', checkValidation, controller.getSignedUrl);

export default router