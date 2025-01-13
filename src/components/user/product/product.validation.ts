import { Schema } from 'express-validator';
import { VALIDATION_OBJECT, VALIDATION_STRING } from '../../../constants/validation';

export const FILTER_SCHEMA: Schema = {
  keyword: VALIDATION_STRING('query', '1120', 'optional'),
  category: VALIDATION_STRING('query', '1129', 'optional'),
  sortBy: VALIDATION_OBJECT('query', '1123'),
  limit: VALIDATION_STRING('query', '1023'),
  page: VALIDATION_STRING('query', '1024'),
};
