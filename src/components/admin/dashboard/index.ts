import express from 'express';
import { checkSchema } from 'express-validator';

import * as controller from './dashboard.controller';

import { checkValidation } from '../../../utils/validation';
import { GET_DASHBOARD_GRAPH_SCHEMA, GET_DASHBOARD_SCHEMA } from './dashboard.validation';

const router = express.Router();

router.get('/company/club/total', checkSchema(GET_DASHBOARD_SCHEMA), checkValidation, controller.getTotalCmyAndClubs);
router.get(
  '/company/club/graph',
  checkSchema(GET_DASHBOARD_GRAPH_SCHEMA),
  checkValidation,
  controller.getGraphTotalRegister,
);

export default router;
