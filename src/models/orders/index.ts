import { ClientSession } from 'mongoose';
import { NewOrderDocument, UpdateOrderDocument } from '../@types';
import { Order } from './orders.entity';

export const saveOrder = async (order: NewOrderDocument, session?: ClientSession | null | undefined) => {
  try {
    const newOrder = new Order(order);
    await newOrder.save({ session });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateOrder = async (
  id: string,
  updateDoc: UpdateOrderDocument,
  session?: ClientSession | null | undefined,
) => {
  try {
    await Order.findOneAndUpdate({ orderId: id }, { $set: updateDoc }, { session });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const order = await Order.findOne({ orderId });
    return Promise.resolve(order);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getOrdersByFilter = async (
  filter: Partial<Record<string, any>> = {},
  page: number = 1,
  limit: number = 10,
) => {
  try {
    const options = {
      page,
      limit,
      sort: { createdAt: -1 }, // Sort by most recent orders
    };
    const orders = await Order.paginate(filter, options);
    return Promise.resolve(orders);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteOrder = async (orderId: string, session?: ClientSession | null | undefined) => {
  try {
    await Order.deleteOne({ orderId }, { session });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
