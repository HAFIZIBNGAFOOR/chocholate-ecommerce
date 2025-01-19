import express from 'express';
const router = express.Router();
import * as controller from './order.controller';
import { checkValidation } from '../../../utils/validation';
import { checkSchema } from 'express-validator';
import { ORDER_ID_SCHEMA, PAGINATION_SCHEMA } from './order.validation';

router.put('/:orderId/confirm', checkSchema(ORDER_ID_SCHEMA), checkValidation, controller.confirmOrder);
router.get('/', checkSchema(PAGINATION_SCHEMA), checkValidation, controller.getOrders);

export default router;
