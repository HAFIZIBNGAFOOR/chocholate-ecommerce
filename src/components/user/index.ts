import express from 'express';

import authComponent from './auth';
import utilsComponent from './utils';

// import profileComponent from './profile';

import { isAuthenticated } from '../../utils/auth';

const router = express.Router();

router.use('/auth', authComponent);
router.use('/utils', utilsComponent);
// router.use('/profile', isAuthenticated, profileComponent);

export default router;
