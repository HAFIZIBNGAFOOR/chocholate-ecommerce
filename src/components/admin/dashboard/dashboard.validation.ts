import { Schema } from 'express-validator';
import { VALIDATION_DATE } from '../../../constants/validation';

export const GET_DASHBOARD_SCHEMA: Schema = {
  // clubId: VALIDATION_STRING('params'),
};

export const GET_DASHBOARD_GRAPH_SCHEMA: Schema = {
  startDate: VALIDATION_DATE('query'),
  endDate: VALIDATION_DATE('query'),
};
