import { handleResponse } from '../../../middleware/requestHandle';
import { NextFunction, Request, Response } from 'express';
import { getProductById, getProducts } from '../../../models/product';

export const getProductsByFilter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, keyword, sortBy, category } = req.query;
    // Build filter criteria
    const filter: any = {
      name: { $regex: keyword, $options: 'i' },
    };

    if (category) filter.category = category;

    // Fetch products with pagination, filtering, and sorting
    const products = await getProducts(filter, parseInt(page as string), parseInt(limit as string), sortBy);

    handleResponse(res, 200, { products });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const product = await getProductById(productId);
    handleResponse(res, 200, { product });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getSuggestedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    // const products =
  } catch (error) {
    console.log(error);
    next(error);
  }
};
