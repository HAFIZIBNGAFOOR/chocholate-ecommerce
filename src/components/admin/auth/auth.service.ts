import {
  badImplementationException,
  dataNotExistException,
  HttpException,
  invalidException,
} from '../../../utils/apiErrorHandler';
import {
  AdminDocument,
  NewAdminDocument,
  NewCompanyDocument,
  NewTokenAdminDocument,
  NewTokenDocument,
  NewUserDocument,
} from '../../../models/@types';

import { addCompany } from '../../../models/company';
import { Users } from '../../../models/user/user.entity';
import { getAddToCurrentJST } from '../../../utils/dayjs';
import { v4 as uuidv4 } from 'uuid';
import { addAdminToken, addToken, deleteToken, getTokenByID } from '../../../models/token';
import { sendMessage } from '../../../utils/sgMailer';
import { addAdmin, updateAdminFields } from '../../../models/admin';
import { MESSAGE_RESET_PASSWORD } from './auth.message';
import { sentMail } from '../../../utils/nodemailer';
// import { CONFIRM_REGISTRATION_MESSAGE } from './auth.message';

export const createAdmin = async (newAdmin: NewAdminDocument) => {
  let error: Error | HttpException | undefined, session, data;
  try {
    session = await Users.startSession();
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

// export const verifyEmail = async (email: string) => {
//   let error: Error | HttpException | undefined;
//   try {
//     const expiredAt = new Date(getAddToCurrentJST(1, 'h'));
//     const newToken: NewTokenDocument = {
//       tokenId: uuidv4(),
//       userId: null,
//       tokenType: 'registration',
//       email,
//       expiredAt,
//     };

//     await addToken(newToken);

//     const tokenUrl = process.env.FRONTEND_COMPANY_URL + '/company/register?tokenId=' + newToken.tokenId;

//     await sentMail(CONFIRM_REGISTRATION_MESSAGE(email, tokenUrl));

//     return Promise.resolve('success');
//   } catch (err) {
//     console.error(err);
//     error = err instanceof Error ? err : badImplementationException(err);
//     return Promise.reject(error);
//   }
// };
export const forgotPassword = async (admin: AdminDocument) => {
  let error: Error | HttpException | undefined;
  try {
    const expiredAt = new Date(getAddToCurrentJST(1, 'h'));
    const newToken: NewTokenAdminDocument = {
      tokenId: uuidv4(),
      adminId: admin.adminId,
      tokenType: 'passwordReset',
      email: admin.email,
      expiredAt,
    };

    await addAdminToken(newToken);

    // let tokenUrl = '';
    // admin.privilege === 'superAdmin'
    //   ? process.env.FRONTEND_COMPANY_URL + '/superAdmin'
    //   : admin.privilege === 'general' ?
    //   ? process.env.FRONTEND_CLUB_URL + '/general'
    //   : process.env.FRONTEND_CLUB_MEMBER_URL + '/';
    let tokenUrl = `${process.env.FRONTEND_ADMIN_URL}/reset-password/` + newToken.tokenId;

    await sentMail(MESSAGE_RESET_PASSWORD(admin.email, tokenUrl));

    return Promise.resolve();
  } catch (err) {
    console.error(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};

export const resetPassword = async (password: string, tokenId: string) => {
  let error: Error | HttpException | undefined;
  try {
    const token = await getTokenByID(tokenId);

    if (!token) throw dataNotExistException('Token does not exist');
    if (token.tokenType !== 'passwordReset') throw invalidException('Token is not valid token type', 'TSM105');
    if (!token?.adminId) throw invalidException('Token is not valid token type', 'TSM105');

    await updateAdminFields(token.adminId, { password });

    await deleteToken(tokenId);

    return Promise.resolve();
  } catch (err) {
    console.log(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};
