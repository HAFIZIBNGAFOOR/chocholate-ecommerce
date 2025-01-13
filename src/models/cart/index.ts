import { ClientSession } from 'mongoose';
import { Cart } from './cart.entity';
import { CartDocument } from '../@types';

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
  updateDoc: Partial<CartDocument>,
  session?: ClientSession | null | undefined,
) => {
  try {
    await Cart.findOneAndUpdate({ userId }, { $set: updateDoc }, { session });
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
      { $match: { userId } }, // Match the user's cart
      {
        $unwind: { path: '$items', preserveNullAndEmptyArrays: true }, // Deconstruct items array
      },
      {
        $lookup: {
          from: 'products', // Name of the product collection
          localField: 'items.productId', // Match productId from cart
          foreignField: 'productId', // Match productId from Product
          as: 'productDetails', // Output array of matched products
        },
      },
      {
        $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true }, // Flatten productDetails array
      },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          items: {
            $push: {
              productId: '$items.productId',
              quantity: '$items.quantity',
              productDetails: {
                name: '$productDetails.name',
                image: { $arrayElemAt: ['$productDetails.images', 0] }, // First image
                category: '$productDetails.category',
                price: '$productDetails.price',
                discountedPrice: '$productDetails.discountedPrice',
              },
            },
          },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
        },
      },
    ]);

    return Promise.resolve(cart[0] || null); // Return the cart object or null if not found
  } catch (error) {
    return Promise.reject(error);
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
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      // If no cart exists for the user, create a new one
      const newCart = new Cart({ userId, items: [{ productId, quantity }] });
      await newCart.save({ session });
    } else {
      const existingItem = cart.items.find((item: any) => item.productId === productId);
      if (existingItem) {
        existingItem.quantity = quantity; // Update the quantity
      } else {
        cart.items.push({ productId, quantity }); // Add new item
      }
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
