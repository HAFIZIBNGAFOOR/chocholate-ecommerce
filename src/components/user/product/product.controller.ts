import { NextFunction, Request, Response } from 'express';
import { NewProductDocument, UpdateProductDocument } from '../../../models/@types';
import { generatedId } from '../../../utils/randomId';
import { Product } from '../../../models/product/product.entity';
import { saveProduct, updateProduct } from '../../../models/product';
import { handleResponse } from '../../../middleware/requestHandle';

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
