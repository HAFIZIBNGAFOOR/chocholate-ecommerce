import { Schema } from 'express-validator';
import { VALIDATION_ARRAY, VALIDATION_ENUM, VALIDATION_NUMBER, VALIDATION_STRING } from '../../../constants/validation';

export const ADD_ORDER_SCHEMA: Schema = {
  userId: VALIDATION_STRING('body', ''),
  products: VALIDATION_ARRAY('body', ''),
  'products.*.productId': VALIDATION_STRING('body', ''),
  'products.*.quantity': VALIDATION_NUMBER('body', ''),
  'products.*.price': VALIDATION_NUMBER('body', ''),
  totalAmount: VALIDATION_NUMBER('body', ''),
  paymentMethod: VALIDATION_ENUM('body', ['card', 'cash', 'wallet'], ''),
  address: VALIDATION_STRING('body', ''),
};

export const UPDATE_ORDER_SCHEMA: Schema = {
  status: VALIDATION_ENUM('body', ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'], ''),
  discount: VALIDATION_NUMBER('body', ''),
  finalAmount: VALIDATION_NUMBER('body', ''),
};

export const ORDER_ID_SCHEMA: Schema = {
  orderId: VALIDATION_STRING('params', ''),
};