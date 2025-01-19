import express from 'express';
import * as controller from './cart.controller';
import { checkValidation } from '../../../utils/validation';
import { checkSchema } from 'express-validator';
import {
  ADD_TO_CART_SCHEMA,
  UPDATE_CART_ITEM_SCHEMA,
  REMOVE_CART_ITEM_SCHEMA,
  USER_ID_SCHEMA,
} from './cart.validation';

const router = express.Router();

// Add a new item to the cart
router.post('/add', checkSchema(ADD_TO_CART_SCHEMA), checkValidation, controller.addToCart);

// Update an existing cart item's quantity
router.put('/update', checkSchema(UPDATE_CART_ITEM_SCHEMA), checkValidation, controller.updateCartItem);

// Remove an item from the cart
router.delete('/remove', checkSchema(REMOVE_CART_ITEM_SCHEMA), checkValidation, controller.removeCartItem);

// Get cart by userId
router.get('/', checkSchema(USER_ID_SCHEMA), checkValidation, controller.getCartById);

// Clear the entire cart
router.delete('/clear', checkSchema(USER_ID_SCHEMA), checkValidation, controller.clearCartItem);

export default router;
