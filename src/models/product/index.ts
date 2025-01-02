import { ClientSession } from 'mongoose';
import { NewProductDocument } from '../@types';
import { Product } from './product.entity';

export const addProduct = async (product: NewProductDocument, session?: ClientSession | null | undefined) => {
  try {
    const newProduct = new Product(product);
    await newProduct.save({ session });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
