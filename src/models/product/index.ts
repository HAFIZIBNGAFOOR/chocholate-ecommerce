import { ClientSession } from 'mongoose';
import { NewProductDocument, OrderProducts, UpdateProductDocument } from '../@types';
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
    const product = await Product.findOne({ productId })
      .select('-updatedAt')
      .select('-createdAt')
      .select('-__v')
      .select('-id');
    return Promise.resolve(product);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProductByName = async (name: string) => {
  try {
    const product = await Product.findOne({ name });
    return Promise.resolve(product);
  } catch (error) {
    return Promise.reject(error);
  }
};
export const getProducts = async (filter: any = {}, page: number = 1, limit: number = 10, sortBy: any = {}) => {
  try {
    const options = {
      page,
      limit,
      sort: sortBy, // Sorting based on query parameter (e.g., { price: -1 })
      select: 'productId name description category price stock nutritionInfo ingredients images',
    };
    const products = await Product.paginate(filter, options);

    return Promise.resolve(products);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getSuggestedProducts = async (productId: string) => {
  try {
    const suggestedProducts = await Product.find(
      { productId: { $ne: productId } }, // Exclude the product with the specified productId
      {
        productId: 1,
        name: 1,
        description: 1,
        category: 1,
        price: 1,
        stock: 1,
        nutritionInfo: 1,
        ingredients: 1,
        images: 1,
      }, // Project only the specified fields
    );

    return Promise.resolve(suggestedProducts);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateProductsStock = async (products: OrderProducts[], session?: ClientSession | undefined) => {
  try {
    const bulkOperations = products.map(({ productId, quantity }) => ({
      updateOne: {
        filter: { productId },
        update: { $inc: { stock: -quantity } }, // Reduce stock by ordered quantity
      },
    }));

    if (bulkOperations.length > 0) {
      await Product.bulkWrite(bulkOperations, { session });
    }
    return;
  } catch (error) {
    return Promise.reject(error);
  }
};
