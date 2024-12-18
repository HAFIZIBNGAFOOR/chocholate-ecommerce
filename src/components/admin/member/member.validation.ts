import { Schema } from 'express-validator';
import { VALIDATION_STRING } from '../../../constants/validation';

export const GET_MEMBER_SCHEMA: Schema = {
  adminId: VALIDATION_STRING('params'),
};

export const GET_MEMBERS_SCHEMA: Schema = {};

export const GET_MEMBERS_OFFSET_SCHEMA: Schema = {
  offset: VALIDATION_STRING('query'),
  limit: VALIDATION_STRING('query'),
};
