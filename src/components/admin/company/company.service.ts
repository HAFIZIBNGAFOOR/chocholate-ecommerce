import mongoose from 'mongoose';
import { addCompany, getCompanyByID } from '../../../models/company';
import { addNotification } from '../../../models/notification';
import { addUser, updateUserFields } from '../../../models/user';
import { badImplementationException, dataNotExistException, HttpException } from '../../../utils/apiErrorHandler';
import { getCurrentJST } from '../../../utils/dayjs';
import { generatedId } from '../../../utils/randomId';
import { NewCompanyDocument, NewUserDocument } from '../../../models/@types';
import { CONFIRM_REGISTRATION_MESSAGE } from './company.message';
import { sentMail } from '../../../utils/nodemailer';

export const suspendDeleted = async (companyId: string) => {
  try {
    const company = await getCompanyByID(companyId);
    if (!company) throw dataNotExistException('company Id does not exits');
    await updateUserFields(company.userId, {
      status: 'Inactive',
      deletedAt: new Date(getCurrentJST()),
    });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createCompany = async (newUser: NewUserDocument, newCompany: NewCompanyDocument) => {
  let error: Error | HttpException | undefined, session, data;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    await addCompany(newCompany, session);

    await addUser(newUser, session);
    await addNotification({ notificationId: generatedId(), userId: newUser.userId, readBy: true }, session);

    await session.commitTransaction();
  } catch (err) {
    error = err instanceof Error ? err : badImplementationException(err);

    if (session) await session.abortTransaction();
    return Promise.reject(error);
  } finally {
    if (session) session.endSession();
  }
  if (!error) {
    await sentMail(CONFIRM_REGISTRATION_MESSAGE(newUser.email, newUser.password));

    return Promise.resolve();
  }
};
