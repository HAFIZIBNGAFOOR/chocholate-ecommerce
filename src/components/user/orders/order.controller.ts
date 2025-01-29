import { NextFunction, Request, Response } from 'express';
import { NewOrderDocument, UpdateOrderDocument } from '../../../models/@types';
import { generatedId } from '../../../utils/randomId';
// import { saveOrder, updateOrder, getOrderById } from '../../../models/order';
import { handleResponse } from '../../../middleware/requestHandle';
import { saveOrder, updateOrder } from '../../../models/orders';
import * as service from './order.service';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user;
    if (!userId) throw Error('1023');
    const { products, totalAmount, discount, finalAmount, address } = req.body;
    const orderDoc: NewOrderDocument = {
      orderId: generatedId(),
      userId,
      products,
      totalAmount,
      discount,
      finalAmount,
      status: 'pending',
      address,
    };
    await service.addOrder(orderDoc, products);
    return handleResponse(res, 200, { message: 'Order created successfully,Admin will verify the order shortly' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// export const confirmOrderById = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const updateDoc: UpdateOrderDocument = {
//       status,
//     };
//     await updateOrder(orderId, updateDoc);
//     return handleResponse(res, 200, { message: 'Order updated successfully' });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

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
