import { NextFunction, Request, Response } from 'express';
import { NewProductDocument, UpdateProductDocument } from '../../../models/@types';
import { generatedId } from '../../../utils/randomId';
import { getProductById, saveProduct, updateProduct } from '../../../models/product';
import { handleResponse } from '../../../middleware/requestHandle';
import * as service from './product.service';

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, category, price, discount, stock, weight, ingredients, images } = req.body;
    const prodDoc: NewProductDocument = {
      productId: generatedId(),
      name,
      description,
      category,
      price,
      discount,
      stock,
      weight,
      ingredients,
      images,
      isFeatured: false,
      status: 'available',
    };
    await saveProduct(prodDoc);
    return handleResponse(res, 200, {});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updatesProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { name, description, category, price, discount, stock, weight, ingredients, images } = req.body;
    const prodDoc: UpdateProductDocument = {
      productId: generatedId(),
      name,
      description,
      category,
      price,
      discount,
      stock,
      weight,
      ingredients,
      images,
      isFeatured: false,
      status: stock !== 0 ? 'available' : 'out-of-stock',
    };
    await updateProduct(productId, prodDoc);
    handleResponse(res, 200, {});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getProductByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const product = await getProductById(productId);
    handleResponse(res, 200, { product });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getProductsByFilter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, keyword, sortBy, category } = req.query;
    // Build filter criteria
    let sort;
    if (!sortBy) sort = { createdAt: -1 };
    else sort = sortBy;
    const filter: any = {
      name: { $regex: keyword, $options: 'i' },
    };

    if (category) filter.category = category;

    // Fetch products with pagination, filtering, and sorting
    const products = await service.getProducts(filter, parseInt(page as string), parseInt(limit as string), sort);

    handleResponse(res, 200, { products });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
