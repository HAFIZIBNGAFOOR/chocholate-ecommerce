import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: [{ type: { productId: { type: String }, quantity: { type: Number } } }],
  },
  { timestamps: true },
);

export const Cart = mongoose.model('Cart', CartSchema);
