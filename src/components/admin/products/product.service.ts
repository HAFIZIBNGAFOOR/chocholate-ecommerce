import { Product } from "../../../models/product/product.entity";

export const getProducts = async (filter: any = {}, page: number = 1, limit: number = 10, sortBy: any = {}) => {
  try {
    const options = {
      page,
      limit,
      sort: sortBy, // Sorting based on query parameter (e.g., { price: -1 })
    };
    const products = await Product.paginate(filter, options);
    return Promise.resolve(products);
  } catch (error) {
    return Promise.reject(error);
  }
};