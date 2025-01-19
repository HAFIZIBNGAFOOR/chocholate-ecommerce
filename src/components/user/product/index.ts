import express from 'express';
const router = express.Router();
import * as controller from './product.controller';
import { checkValidation } from '../../../utils/validation';
import { checkSchema } from 'express-validator';



router.get('/',controller.getProductsByFilter)
export default router;
