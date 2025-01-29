import { ClientSession } from 'mongoose';
import { Cart } from './cart.entity';
import { CartDocument } from '../@types';
import { Product } from '../product/product.entity';
import { getProductById } from '../product';
import { generatedId } from '../../utils/randomId';

/**
 * Save a new cart.
 */
export const saveCart = async (cart: CartDocument, session?: ClientSession | null | undefined) => {
  try {
    const newCart = new Cart(cart);
    await newCart.save({ session });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Update a cart by userId.
 */
export const updateCart = async (
  userId: string,
  productId: string,
  quantity: number,
  session?: ClientSession | null | undefined,
) => {
  try {
    // Check if quantity is valid
    if (quantity < 0) throw new Error('Quantity must be a non-negative number');

    // Fetch the cart for the user
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    // Find the product in the cart items
    const item = cart.items.find((item: any) => item.productId === productId);
    if (!item) throw new Error('Product not found in the cart');

    if (quantity === 0) {
      // If quantity is 0, remove the item from the cart
      cart.items = cart.items.filter((item: any) => item.productId !== productId);
    } else {
      // Update the quantity and recalculate the item's total price
      item.quantity = quantity;
      item.totalPrice = item.price * quantity;
    }

    // Recalculate the cart's total price
    cart.totalPrice = cart.items.reduce((total: number, item: any) => total + item.totalPrice, 0);

    // Save the updated cart
    await cart.save({ session });

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Get a cart by userId.
 */
export const getCartWithProductDetails = async (userId: string) => {
  try {
    const cart = await Cart.aggregate([
      // Match the cart for the user
      { $match: { userId } },

      // Unwind the items array to work with each individual item
      { $unwind: '$items' },

      // Look up product details from the Product collection based on productId
      {
        $lookup: {
          from: 'products', // Name of the product collection
          localField: 'items.productId', // Field in Cart items array
          foreignField: 'productId', // Field in Product collection (assuming it's the _id)
          as: 'productDetails',
        },
      },

      // Unwind the productDetails array (since $lookup returns an array)
      { $unwind: '$productDetails' },

      // Project the necessary fields (you can add any fields you want here)
      {
        $project: {
          cartId: 1,
          userId: 1,
          'items.productId': 1,
          'items.quantity': 1,
          'items.price': 1,
          'items.totalPrice': 1,
          'productDetails.name': 1,
          'productDetails.price': 1,
          'productDetails.images': 1,
          'productDetails.productId': 1, // Include productId
          totalPrice: 1,
        },
      },

      // Group back the items into an array, if needed
      {
        $group: {
          _id: '$_id',
          cartId: { $first: '$cartId' },
          userId: { $first: '$userId' },
          items: { $push: '$items' }, // Rebuild the items array
          cartTotalPrice: { $first: '$totalPrice' },
        },
      },
    ]);

    // Return the cart with product details
    return cart.length > 0 ? cart[0] : cart;
  } catch (error) {
    console.error('Error fetching cart with product details:', error);
    throw error;
  }
};

/**
 * Add an item to the cart.
 */
export const addItemToCart = async (
  userId: string,
  productId: string,
  quantity: number,
  session?: ClientSession | null | undefined,
) => {
  try {
    // Fetch product price from the database
    const product = await getProductById(productId); // Assuming a `Product` model exists
    if (!product) throw new Error('Product not found');

    const productPrice = product.price;
    const itemTotalPrice = productPrice * quantity;

    const cart = await getCartByUserId(userId);
    if (!cart) {
      // If no cart exists for the user, create a new one
      const newCart = new Cart({
        cartId: generatedId(),
        userId,
        items: [
          {
            productId,
            quantity,
            price: productPrice,
            totalPrice: itemTotalPrice,
          },
        ],
        totalPrice: itemTotalPrice, // Set cart's totalPrice
      });
      await newCart.save({ session });
    } else {
      const existingItem = cart.items.find((item: any) => item.productId === productId);
      if (existingItem) {
        existingItem.quantity = quantity; // Update the quantity
        existingItem.totalPrice = productPrice * quantity; // Update item's total price
      } else {
        cart.items.push({
          productId,
          quantity,
          price: productPrice,
          totalPrice: itemTotalPrice,
        }); // Add new item
      }

      // Recalculate the cart's total price
      cart.totalPrice = cart.items.reduce((total: number, item: any) => total + item.totalPrice, 0);
      await cart.save({ session });
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Remove an item from the cart.
 */
export const removeItemFromCart = async (
  userId: string,
  productId: string,
  session?: ClientSession | null | undefined,
) => {
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return Promise.reject(new Error('Cart not found'));

    cart.items = cart.items.filter((item: any) => item.productId !== productId);
    await cart.save({ session });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Clear all items in a cart.
 */
export const clearCart = async (userId: string, session?: ClientSession | null | undefined) => {
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return Promise.reject(new Error('Cart not found'));

    cart.items = []; // Clear all items
    await cart.save({ session });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCartByUserId = async (userId: string) => {
  try {
    const cart = await Cart.findOne({ userId });
    return Promise.resolve(cart);
  } catch (error) {
    return Promise.reject(error);
  }
};
