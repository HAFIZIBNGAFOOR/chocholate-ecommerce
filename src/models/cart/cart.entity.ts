import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema(
  {
    cartId: { type: String, required: true },
    userId: { type: String, required: true },
    items: [
      {
        type: {
          productId: { type: String },
          quantity: { type: Number },
          price: { type: Number }, // Add price for each product
          totalPrice: { type: Number },
        },
      },
    ],
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Cart = mongoose.model('Cart', CartSchema);
