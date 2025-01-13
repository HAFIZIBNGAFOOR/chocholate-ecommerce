import express from 'express';

import ordersComponent from './orders';
import productComponent from './products';

// import { isAuthenticated } from '../../utils/auth';

const router = express.Router();

router.use('/orders', ordersComponent);
router.use('/product', productComponent);

export default router;
