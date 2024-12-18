import { badImplementationException, HttpException } from '../../../utils/apiErrorHandler';
import { NewCompanyDocument, NewTokenDocument, NewUserDocument } from '../../../models/@types';
import { addUser } from '../../../models/user';
import { addCompany } from '../../../models/company';
import { Users } from '../../../models/user/user.entity';
import { getAddToCurrentJST } from '../../../utils/dayjs';
import { v4 as uuidv4 } from 'uuid';
import { addToken, deleteToken } from '../../../models/token';
import { sendMessage } from '../../../utils/sgMailer';
import { CONFIRM_REGISTRATION_MESSAGE } from './auth.message';
import { addNotification } from '../../../models/notification';
import { generatedId } from '../../../utils/randomId';
import { sentMail } from '../../../utils/nodemailer';
import mongoose from 'mongoose';

export const createCompany = async (newUser: NewUserDocument, newCompany: NewCompanyDocument, tokenId: string) => {
  let error: Error | HttpException | undefined, session, data;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    await addCompany(newCompany, session);
    await addUser(newUser, session);
    await addNotification({ notificationId: generatedId(), userId: newUser.userId, readBy: true }, session);

    await deleteToken(tokenId, session);

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

export const verifyEmail = async (email: string) => {
  let error: Error | HttpException | undefined;
  try {
    const expiredAt = new Date(getAddToCurrentJST(1, 'h'));
    const newToken: NewTokenDocument = {
      tokenId: uuidv4(),
      userId: null,
      tokenType: 'registration',
      userType: 'companyAdmin',
      email,
      expiredAt,
    };

    await addToken(newToken);

    const tokenUrl = process.env.FRONTEND_COMPANY_URL + '/register?tokenId=' + newToken.tokenId;

    await sentMail(CONFIRM_REGISTRATION_MESSAGE(email, tokenUrl));

    return Promise.resolve('success');
  } catch (err) {
    console.error(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};
