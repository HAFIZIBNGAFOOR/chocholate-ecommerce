import { Schema } from 'express-validator';
import {
  VALIDATION_EMAIL_NOT_EXIST,
  VALIDATION_NUMBER,
  VALIDATION_PASSWORD,
  VALIDATION_STRING,
  VALIDATION_UNIVERSITY_ID,
} from '../../../constants/validation';

export const GET_UNIVERSITY_ID_SCHEMA: Schema = {
  universityId: VALIDATION_UNIVERSITY_ID('params'),
};

export const GET_UNIVERSITY_SCHEMA: Schema = {
  offset: VALIDATION_NUMBER('query'),
  limit: VALIDATION_NUMBER('query'),
};

export const GET_UNIVERSITY_ALL_SCHEMA: Schema = {};
export const CREATE_UNIVERSITY_SCHEMA: Schema = {};
