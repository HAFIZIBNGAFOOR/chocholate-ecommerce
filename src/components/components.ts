import express from 'express';
const router = express.Router();

// import authComponent from "./auth";
import adminComponent from './admin';
import userComponent from './user';
import utilsComponent from './utils';
import { isAuth } from '../utils/auth';

router.use('/admin', adminComponent);
router.use('/user', userComponent);
router.use('/utils',isAuth, utilsComponent);

router.get('/health', (req, res, next) => res.json());

export default router;
