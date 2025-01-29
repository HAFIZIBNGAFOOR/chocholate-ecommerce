import { Schema } from 'express-validator';
import { VALIDATION_STRING, VALIDATION_NUMBER, VALIDATION_PRODUCT_ID } from '../../../constants/validation';

export const ADD_TO_CART_SCHEMA: Schema = {
  productId: VALIDATION_PRODUCT_ID('body'),
  quantity: VALIDATION_NUMBER('body', 'Quantity must be a valid number'),
};

export const UPDATE_CART_ITEM_SCHEMA: Schema = {
  productId: VALIDATION_PRODUCT_ID('body'),
  quantity: VALIDATION_NUMBER('body', 'Quantity must be a valid number'),
};

export const REMOVE_CART_ITEM_SCHEMA: Schema = {
  productId: VALIDATION_PRODUCT_ID('body'),
};

export const USER_ID_SCHEMA: Schema = {
};
