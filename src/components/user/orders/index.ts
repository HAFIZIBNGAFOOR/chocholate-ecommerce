import express from 'express';
const router = express.Router();
import * as controller from './order.controller';
import { checkValidation } from '../../../utils/validation';
import { checkSchema } from 'express-validator';
import { ADD_ORDER_SCHEMA, ORDER_ID_SCHEMA, UPDATE_ORDER_SCHEMA } from './order.validation';

router.post('/', checkSchema(ADD_ORDER_SCHEMA), checkValidation, controller.createOrder);
router.put('/:orderId', checkSchema(UPDATE_ORDER_SCHEMA), checkValidation, controller.updateOrderById);
router.patch('/:orderId/cancel', checkSchema(ORDER_ID_SCHEMA), checkValidation, controller.cancelOrder);
router.patch('/:orderId/confirm', checkSchema(ORDER_ID_SCHEMA), checkValidation, controller.confirmOrder);

export default router;
