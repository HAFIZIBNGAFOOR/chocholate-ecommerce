import express from 'express';

import authComponent from './auth';
import clubComponent from './club';
import companyComponent from './company';
import universityComponent from './university';
import memberComponent from './member';
import dashBoardComponent from './dashboard';
const router = express.Router();

router.use('/auth', authComponent);
router.use('/club', clubComponent);
router.use('/universities', universityComponent);
router.use('/companies', companyComponent);
router.use('/members', memberComponent);
router.use('/dashboard', dashBoardComponent);

export default router;
