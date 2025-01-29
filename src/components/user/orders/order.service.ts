import mongoose from 'mongoose';
import { NewOrderDocument, OrderProducts } from '../../../models/@types';
import { badImplementationException, HttpException } from '../../../utils/apiErrorHandler';
import { saveOrder } from '../../../models/orders';
import { updateProductsStock } from '../../../models/product';

export const addOrder = async (orderDocument: NewOrderDocument, products: OrderProducts[]) => {
  let error: Error | HttpException | undefined, session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    await saveOrder(orderDocument, session);
    await updateProductsStock(products, session);
    await session.commitTransaction();
  } catch (err) {
    error = err instanceof Error ? err : badImplementationException(err);
    if (session) await session.abortTransaction();
    return Promise.reject(err);
  } finally {
    if (session) session.endSession();
  }
  if (!error) {
    return Promise.resolve();
  }
};
