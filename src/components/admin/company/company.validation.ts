import { Schema } from 'express-validator';
import {
  VALIDATION_BOOLEAN,
  VALIDATION_CATEGORY,
  VALIDATION_EMAIL_NOT_EXIST,
  VALIDATION_NUMBER,
  VALIDATION_STRING,
} from '../../../constants/validation';
import { industryCategory } from '../../../constants/variable';

export const GET_COMPANY_SCHEMA: Schema = {
  companyId: VALIDATION_STRING('params'),
};

export const GET_COMPANY_WITH_SCHEMA: Schema = {
  offset: VALIDATION_NUMBER('query'),
  limit: VALIDATION_NUMBER('query'),
};

export const GET_COMPANY_DATA: Schema = {
  fieldName: VALIDATION_STRING('query'),
};

export const CREATE_COMPANY_SCHEMA: Schema = {
  name: VALIDATION_STRING('body'),
  email: VALIDATION_EMAIL_NOT_EXIST('body'),
  province: VALIDATION_STRING('body'),
  city: VALIDATION_STRING('body'),
  address: VALIDATION_STRING('body'),
  phoneNo: VALIDATION_STRING('body'),
  industry: VALIDATION_CATEGORY('body', industryCategory),
  zipCode: VALIDATION_NUMBER('body', 'optional'),
  website: VALIDATION_STRING('body', 'optional'),
  logoUrl: VALIDATION_STRING('body', 'optional'),
  promotion: VALIDATION_STRING('body', 'optional'),
  isPublic: VALIDATION_BOOLEAN('body', 'optional'),
  numOfEmployees: VALIDATION_STRING('body', 'optional'),
};
