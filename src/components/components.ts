import express from 'express';
const router = express.Router();

// import authComponent from "./auth";
import adminComponent from './admin';
import userComponent from './user';
import companyComponent from './company';
import clubComponent from './club';
import clubMemberComponent from './clubMember';

router.use('/admin', adminComponent);
router.use('/company', companyComponent);
router.use('/user', userComponent);
router.use('/club', clubComponent);
router.use('/clubMember', clubMemberComponent);
router.get('/health', (req, res, next) => res.json());

export default router;
