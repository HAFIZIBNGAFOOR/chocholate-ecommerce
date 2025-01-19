import { Schema } from 'express-validator';
import { VALIDATION_ARRAY, VALIDATION_ENUM, VALIDATION_NUMBER, VALIDATION_STRING } from '../../../constants/validation';

export const PAGINATION_SCHEMA: Schema = {
  page: VALIDATION_NUMBER('query', 'Page must be a valid number', 'optional'),
  limit: VALIDATION_NUMBER('query', 'Limit must be a valid number', 'optional'),
};

export const ORDER_ID_SCHEMA: Schema = {
  orderId: VALIDATION_STRING('params', ''),
};
