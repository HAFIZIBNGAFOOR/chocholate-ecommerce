import express from 'express';
const router = express.Router();
import * as controller from './product.controller';
import { checkValidation } from '../../../utils/validation';
import { checkSchema } from 'express-validator';
import { FILTER_SCHEMA, PRODUCT_ID_SCHEMA } from './product.validation';

router.get('/get', checkSchema(PRODUCT_ID_SCHEMA), checkValidation, controller.getSingleProduct);
router.get('/', checkSchema(FILTER_SCHEMA), checkValidation, controller.getProductsByFilter);
router.get('/suggested/:productId', checkSchema(PRODUCT_ID_SCHEMA), checkValidation);
export default router;
