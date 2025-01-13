import { NextFunction, Request, Response } from 'express';
import { NewOrderDocument, UpdateOrderDocument } from '../../../models/@types';
import { generatedId } from '../../../utils/randomId';
// import { saveOrder, updateOrder, getOrderById } from '../../../models/order';
import { handleResponse } from '../../../middleware/requestHandle';
import { getOrdersByFilter, saveOrder, updateOrder } from '../../../models/orders';

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

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Fetch all orders with pagination
    const orders = await getOrdersByFilter({}, parseInt(page as string), parseInt(limit as string));

    handleResponse(res, 200, { orders });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
