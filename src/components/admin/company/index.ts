import express from 'express';
import { checkSchema } from 'express-validator';

import * as controller from './company.controller';

import { checkValidation } from '../../../utils/validation';
import {
  CREATE_COMPANY_SCHEMA,
  GET_COMPANY_DATA,
  GET_COMPANY_SCHEMA,
  GET_COMPANY_WITH_SCHEMA,
} from './company.validation';
import { isAdmin } from '../../../utils/auth';

const router = express.Router();

router.get('/', isAdmin, checkSchema(GET_COMPANY_WITH_SCHEMA), checkValidation, controller.getCompanies);
router.post('/', isAdmin, checkSchema(CREATE_COMPANY_SCHEMA), checkValidation, controller.createCompany);

router.get(
  '/:companyId/profile',
  isAdmin,
  checkSchema(GET_COMPANY_SCHEMA),
  checkValidation,
  controller.getCompaniesById,
);
router.get(
  '/companiesUnique',
  isAdmin,
  checkSchema(GET_COMPANY_DATA),
  checkValidation,
  controller.getCompaniesUniqueData,
);

router.put(
  '/:companyId/profile',
  isAdmin,
  checkSchema(GET_COMPANY_SCHEMA),
  checkValidation,
  controller.updateCompanyProfile,
);

router.put('/:companyId/suspend', isAdmin, checkSchema(GET_COMPANY_SCHEMA), checkValidation, controller.suspendCompany);
export default router;
