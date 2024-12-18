//TODO

import { NewAdminDocument, NewUniversityDocument } from '../../../models/@types';
import { addAdmin } from '../../../models/admin';
import { Admins } from '../../../models/admin/admin.entity';
import { HttpException, badImplementationException } from '../../../utils/apiErrorHandler';

export const createAdmin = async (newAdmin: NewAdminDocument) => {
  let error: Error | HttpException | undefined, session, data;
  try {
    session = await Admins.startSession();
    session.startTransaction();

    await addAdmin(newAdmin, session);

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
