import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { ProductDocument } from '../@types';

const ProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true }, // e.g., 'Dark Chocolate', 'Milk Chocolate'
    price: { type: Number, required: true },
    discount: {
      type: Number,
      default: 0, // percentage discount
    },
    stock: { type: Number, required: true },
    weight: { type: String }, // e.g., '100g', '250g'
    ingredients: [{ type: String }], // Array of ingredients
    nutritionInfo: {
      calories: { type: Number },
      sugar: { type: Number }, // in grams
      fat: { type: Number }, // in grams
      protein: { type: Number }, // in grams
    },
    images: [{ type: String, required: true }], // Array of image URLs
    tags: [{ type: String }], // e.g., 'vegan', 'sugar-free'
    brand: { type: String },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['available', 'out-of-stock', 'discontinued'],
      default: 'available',
    },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

ProductSchema.virtual('discountedPrice').get(function () {
  const discountFactor = (100 - this.discount) / 100;
  return this.price * discountFactor;
});

// Ensure virtual fields are included in JSON responses
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model<ProductDocument, mongoose.AggregatePaginateModel<ProductDocument>>(
  'product',
  ProductSchema,
  'products',
);
