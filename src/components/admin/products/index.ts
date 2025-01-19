import express from 'express';
const router = express.Router();
import * as controller from './product.controller';
import { checkValidation } from '../../../utils/validation';
import { checkSchema } from 'express-validator';
import { ADD_PRODUCT_SCHEMA, FILTER_SCHEMA, PRODUCT_ID_SCHEMA, UPDATE_PRODUCT_SCHEMA } from './product.validation';

router.post('/', checkSchema(ADD_PRODUCT_SCHEMA), checkValidation, controller.addProduct);
router.put('/:productId', checkSchema(UPDATE_PRODUCT_SCHEMA), checkValidation, controller.updatesProduct);
router.get('/:productId', checkSchema(PRODUCT_ID_SCHEMA), checkValidation, controller.getProductByID);
router.get('/', checkSchema(FILTER_SCHEMA), checkValidation, controller.getProductsByFilter);

export default router;
