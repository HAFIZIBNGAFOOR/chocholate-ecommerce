import { Request, Response, NextFunction } from 'express';
import {
  addItemToCart,
  removeItemFromCart,
  clearCart,
  updateCart,
  getCartWithProductDetails,
} from '../../../models/cart';
import { handleResponse } from '../../../middleware/requestHandle';

/**
 * Add an item to the cart.
 */
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user;
    if (!userId) throw new Error('userId not exist');
    console.log(req.body);
    const { productId, quantity } = req.body;
    await addItemToCart(userId, productId, quantity);
    return handleResponse(res, 200, { message: 'Item added to cart successfully.' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * Update an existing cart item's quantity.
 */
export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user;
    if (!userId) throw new Error('userId not exist');
    const { productId, quantity } = req.body;
    await updateCart(userId, productId, quantity);
    return handleResponse(res, 200, { message: 'Cart item updated successfully.' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * Remove an item from the cart.
 */
export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user;
    if (!userId) throw new Error('userId not exist');

    const { productId } = req.body;
    await removeItemFromCart(userId, productId);
    return handleResponse(res, 200, { message: 'Item removed from cart successfully.' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * Get cart by userId.
 */
export const getCartById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user;
    if (!userId) throw new Error('userId not exist');

    const cart = await getCartWithProductDetails(userId);
    return handleResponse(res, 200, { cart });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * Clear the entire cart.
 */
export const clearCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    await clearCart(userId);
    return handleResponse(res, 200, { message: 'Cart cleared successfully.' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
