import { Schema } from 'express-validator';
import {
  VALIDATION_ARRAY,
  VALIDATION_BOOLEAN,
  VALIDATION_ENUM,
  VALIDATION_NUMBER,
  VALIDATION_NUTRITION_INFO,
  VALIDATION_RATINGS,
  VALIDATION_STRING,
} from '../../../constants/validation';

export const ADD_PRODUCT_SCHEMA: Schema = {
  productId: VALIDATION_STRING('body', '1001'),
  name: VALIDATION_STRING('body', '1002'),
  description: VALIDATION_STRING('body', '1003', 'optional'),
  category: VALIDATION_STRING('body', '1004'),
  price: VALIDATION_NUMBER('body', '1005'),
  discountedPrice: VALIDATION_NUMBER('body', '1006', 'optional'),
  discount: VALIDATION_NUMBER('body', '1007', 'optional'),
  stock: VALIDATION_NUMBER('body', '1008'),
  weight: VALIDATION_STRING('body', '1009', 'optional'),
  ingredients: VALIDATION_ARRAY('body', '1010', 'optional', { isString: true }),
  nutritionInfo: VALIDATION_NUTRITION_INFO('body', '1011'),
  images: VALIDATION_ARRAY('body', '1013', undefined, { isString: true }),
  tags: VALIDATION_ARRAY('body', '1014', 'optional', { isString: true }),
  brand: VALIDATION_STRING('body', '1015', 'optional'),
  isFeatured: VALIDATION_BOOLEAN('body', '1016'), // Using the separate validation function
  status: VALIDATION_ENUM('body', ['available', 'out-of-stock', 'discontinued'], '1017'),
  ratings: VALIDATION_RATINGS('body', '1018'),
};
