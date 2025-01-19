import { handleResponse } from '../../../middleware/requestHandle';
import { NextFunction, Request, Response } from 'express';
import * as service from './product.service';

export const getProductsByFilter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, keyword, sortBy, category } = req.query;
    console.log(req.query);
    // Build filter criteria
    const filter: any = {
      name: { $regex: keyword, $options: 'i' },
    };

    if (category) filter.category = category;

    // Fetch products with pagination, filtering, and sorting
    const products = await service.getProducts(filter, parseInt(page as string), parseInt(limit as string), sortBy);

    handleResponse(res, 200, { products });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
