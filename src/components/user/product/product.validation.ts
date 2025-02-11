import { Schema } from 'express-validator';
import { VALIDATION_OBJECT, VALIDATION_PRODUCT_ID, VALIDATION_STRING } from '../../../constants/validation';

export const FILTER_SCHEMA: Schema = {
  limit: VALIDATION_STRING('query', '1023'),
  page: VALIDATION_STRING('query', '1024'),
};

export const PRODUCT_ID_SCHEMA: Schema = {
  productId: VALIDATION_PRODUCT_ID('params'),
};
