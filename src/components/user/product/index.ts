import express from 'express';
const router = express.Router();
import * as controller from './product.controller';
import { checkValidation } from '../../../utils/validation';
import { checkSchema } from 'express-validator';
import { ADD_PRODUCT_SCHEMA } from './product.validation';

router.post('/', checkSchema(ADD_PRODUCT_SCHEMA), checkValidation, controller.addProduct);
router.put('/', checkValidation, controller.updatesProduct);

export default router;
