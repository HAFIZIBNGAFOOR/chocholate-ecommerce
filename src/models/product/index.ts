import { ClientSession } from 'mongoose';
import { NewProductDocument, UpdateProductDocument } from '../@types';
import { Product } from './product.entity';

export const saveProduct = async (product: NewProductDocument, session?: ClientSession | null | undefined) => {
  try {
    const newProduct = new Product(product);
    await newProduct.save({ session });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateProduct = async (
  id: string,
  updateDoc: UpdateProductDocument,
  session?: ClientSession | null | undefined,
) => {
  try {
    await Product.findOneAndUpdate({ id }, { $set: updateDoc }, { session });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProductById = async (productId: string) => {
  try {
    const product = await Product.findById(productId);
    return Promise.resolve(product);
  } catch (error) {
    return Promise.reject(error);
  }
};


export const getProductsByFilter = async () => {
    try {
        const products = await Product.find()
        return Promise.reject()
    } catch (error) {
        return Promise.reject(error)
    }
}