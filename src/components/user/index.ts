import express from 'express';

import authComponent from './auth';
import utilsComponent from './utils';
import productComponent from './product';
import cartComponent from './cart';
import { isUserAuth } from '../../utils/auth';

const router = express.Router();

router.use('/auth', authComponent);
router.use('/utils', isUserAuth, utilsComponent);
router.use('/product', productComponent);
router.use('/cart', isUserAuth, cartComponent);

export default router;
