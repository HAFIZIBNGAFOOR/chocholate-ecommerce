import express from 'express';

import authComponent from './auth';
import utilsComponent from './utils';
import productComponent from './product';

import { isAuthenticated } from '../../utils/auth';

const router = express.Router();

router.use('/auth', authComponent);
router.use('/utils', isAuthenticated, utilsComponent);
router.use('/product', isAuthenticated, productComponent);

export default router;
