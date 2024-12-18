//TODO

import mongoose from 'mongoose';
import { NewUniversityDocument } from '../../../models/@types';
import { Admins } from '../../../models/admin/admin.entity';
import { addUniversity } from '../../../models/university';
import { HttpException, badImplementationException } from '../../../utils/apiErrorHandler';

export const createUniversity = async (newUniversity: NewUniversityDocument) => {
  let error: Error | HttpException | undefined, session, data;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    await addUniversity(newUniversity, session);

    await session.commitTransaction();
  } catch (err) {
    error = err instanceof Error ? err : badImplementationException(err);

    if (session) await session.abortTransaction();
  } finally {
    if (session) session.endSession();
  }
  if (error) {
    console.error(error);
    return Promise.reject(error);
  } else {
    if (data) return Promise.resolve(data);
    else return Promise.resolve();
  }
};
