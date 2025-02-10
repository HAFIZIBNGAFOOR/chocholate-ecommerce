import express from 'express';
import { checkSchema } from 'express-validator';
import * as controller from './utils.controller';
import { SIGNED_URL_SCHEMA } from './utils.validation';
import { checkValidation } from '../../utils/validation';

const router = express.Router();

router.put('/s3/signedURL', checkSchema(SIGNED_URL_SCHEMA), checkValidation, controller.getSignedUrl);

export default router;
