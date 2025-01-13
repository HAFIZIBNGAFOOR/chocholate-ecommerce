import express from 'express';
const router = express.Router();

// import authComponent from "./auth";
import adminComponent from './admin';
import userComponent from './user';

router.use('/admin', adminComponent);
router.use('/user', userComponent);

router.get('/health', (req, res, next) => res.json());

export default router;
