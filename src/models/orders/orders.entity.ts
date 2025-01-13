import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-paginate-v2';
import { OrderDocument } from '../@types';

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true }, // Unique order ID
    userId: { type: String, required: true }, // Reference to the user who placed the order
    products: [
      {
        productId: { type: String, required: true }, // Reference to the product
        name: { type: String, required: true }, // Product name
        quantity: { type: Number, required: true }, // Quantity ordered
        price: { type: Number, required: true }, // Price per unit
      },
    ],
    totalAmount: { type: Number, required: true }, // Total order amount
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'], // Order statuses
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['card', 'cash', 'wallet'], required: true }, // Payment method
    address: {
      type: String,
      required: true, // Shipping address
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

orderSchema.plugin(aggregatePaginate);

export const Order = mongoose.model<OrderDocument, mongoose.PaginateModel<OrderDocument>>(
  'order',
  orderSchema,
  'orders',
);
