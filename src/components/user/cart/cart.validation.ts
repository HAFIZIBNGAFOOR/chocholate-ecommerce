import { Schema } from 'express-validator';
import { VALIDATION_STRING, VALIDATION_NUMBER } from '../../../constants/validation';

export const ADD_TO_CART_SCHEMA: Schema = {
  productId: VALIDATION_STRING('body', 'Product ID is required'),
  quantity: VALIDATION_NUMBER('body', 'Quantity must be a valid number'),
};

export const UPDATE_CART_ITEM_SCHEMA: Schema = {
  productId: VALIDATION_STRING('body', 'Product ID is required'),
  quantity: VALIDATION_NUMBER('body', 'Quantity must be a valid number'),
};

export const REMOVE_CART_ITEM_SCHEMA: Schema = {
  productId: VALIDATION_STRING('body', 'Product ID is required'),
};

export const USER_ID_SCHEMA: Schema = {
};
