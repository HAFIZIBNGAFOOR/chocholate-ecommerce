import express from 'express';

import authComponent from './auth';
import messageComponent from './message';
import profileComponent from './profile';

import { isAuthenticated } from '../../utils/auth';

const router = express.Router();

router.use('/auth', authComponent);
router.use('/messages', isAuthenticated, messageComponent);
router.use('/profile', isAuthenticated, profileComponent);

export default router;
