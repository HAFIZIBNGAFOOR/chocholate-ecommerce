import { NextFunction, Request, Response } from 'express';
import { NewOrderDocument, UpdateOrderDocument } from '../../../models/@types';
import { generatedId } from '../../../utils/randomId';
// import { saveOrder, updateOrder, getOrderById } from '../../../models/order';
import { handleResponse } from '../../../middleware/requestHandle';
import { saveOrder, updateOrder } from '../../../models/orders';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, products, totalAmount, discount, finalAmount, paymentMethod, address } = req.body;
    const orderDoc: NewOrderDocument = {
      orderId: generatedId(),
      userId,
      products,
      totalAmount,
      discount,
      finalAmount,
      paymentMethod,
      status: 'pending',
      address,
    };
    await saveOrder(orderDoc);
    return handleResponse(res, 200, { message: 'Order created successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const updateDoc: UpdateOrderDocument = req.body;
    await updateOrder(orderId, updateDoc);
    return handleResponse(res, 200, { message: 'Order updated successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    await updateOrder(orderId, { status: 'canceled' });
    return handleResponse(res, 200, { message: 'Order canceled successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const confirmOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    await updateOrder(orderId, { status: 'confirmed' });
    return handleResponse(res, 200, { message: 'Order confirmed successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
