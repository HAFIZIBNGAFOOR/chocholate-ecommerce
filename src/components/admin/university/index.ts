import express from 'express';
import { checkSchema } from 'express-validator';

import * as controller from './university.controller';

import { checkValidation } from '../../../utils/validation';
import {
  CREATE_UNIVERSITY_SCHEMA,
  GET_UNIVERSITY_ALL_SCHEMA,
  GET_UNIVERSITY_ID_SCHEMA,
  GET_UNIVERSITY_SCHEMA,
} from './university.validation';
import { isAdmin } from '../../../utils/auth';

const router = express.Router();

router.get('/', isAdmin, checkSchema(GET_UNIVERSITY_SCHEMA), checkValidation, controller.getUniversities);
router.get('/getAll', isAdmin, checkSchema(GET_UNIVERSITY_ALL_SCHEMA), checkValidation, controller.getUniversitiesAll);
router.get('/unique', isAdmin, checkSchema(GET_UNIVERSITY_ALL_SCHEMA), checkValidation, controller.getUniversityUnique);

router.get(
  '/:universityId',
  isAdmin,
  checkSchema(GET_UNIVERSITY_ID_SCHEMA),
  checkValidation,
  controller.getUniversitiesById,
);

router.post('/', isAdmin, checkSchema(CREATE_UNIVERSITY_SCHEMA), checkValidation, controller.createUniversity);
router.put(
  '/:universityId',
  isAdmin,
  checkSchema(GET_UNIVERSITY_ID_SCHEMA),
  checkValidation,
  controller.updateUniversity,
);
router.put(
  '/:universityId/delete',
  isAdmin,
  checkSchema(GET_UNIVERSITY_ID_SCHEMA),
  checkValidation,
  controller.deleteUniversity,
);
export default router;
