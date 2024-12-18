import express from 'express';
import { checkSchema } from 'express-validator';

import * as controller from './member.controller';

import { checkValidation } from '../../../utils/validation';
import { GET_MEMBER_SCHEMA, GET_MEMBERS_OFFSET_SCHEMA, GET_MEMBERS_SCHEMA } from './member.validation';
import { isSuperAdmin } from '../../../utils/auth';

const router = express.Router();

router.get('/', isSuperAdmin, checkSchema(GET_MEMBERS_OFFSET_SCHEMA), checkValidation, controller.getMembers);
router.get('/:adminId', isSuperAdmin, checkSchema(GET_MEMBERS_SCHEMA), checkValidation, controller.getMembersById);
router.post('/', isSuperAdmin, checkSchema(GET_MEMBERS_SCHEMA), checkValidation, controller.addMember);
router.put('/:adminId', isSuperAdmin, checkSchema(GET_MEMBER_SCHEMA), checkValidation, controller.updateMember);
router.put('/:adminId/delete', isSuperAdmin, checkSchema(GET_MEMBER_SCHEMA), checkValidation, controller.deleteMember);

export default router;
