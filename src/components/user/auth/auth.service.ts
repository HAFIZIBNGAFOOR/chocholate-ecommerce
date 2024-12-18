import {
  badImplementationException,
  dataNotExistException,
  HttpException,
  invalidException,
} from '../../../utils/apiErrorHandler';
import { v4 as uuidv4 } from 'uuid';
import { getAddToCurrentJST } from '../../../utils/dayjs';
import { MESSAGE_RESET_PASSWORD } from './auth.message';
import { NewTokenDocument, UserDocument } from '../../../models/@types';
import { addToken, deleteToken, getTokenByID } from '../../../models/token';
import { updateUserFields } from '../../../models/user';
import { sendMessage } from '../../../utils/sgMailer';
import { sentMail } from '../../../utils/nodemailer';

export const forgotPassword = async (user: UserDocument) => {
  let error: Error | HttpException | undefined;
  try {
    const expiredAt = new Date(getAddToCurrentJST(1, 'h'));
    const newToken: NewTokenDocument = {
      tokenId: uuidv4(),
      userId: user.userId,
      tokenType: 'passwordReset',
      email: user.email,
      userType: user.userType,
      expiredAt,
    };
    // BUG: token not update proper
    await addToken(newToken);

    let tokenUrl =
      user.userType === 'companyAdmin'
        ? (process.env.FRONTEND_COMPANY_URL as string)
        : user.userType === 'clubAdmin'
        ? (process.env.FRONTEND_CLUB_URL as string)
        : (process.env.FRONTEND_CLUB_MEMBER_URL as string);
    tokenUrl += '/reset-password/' + newToken.tokenId;

    await sentMail(MESSAGE_RESET_PASSWORD(user.email, tokenUrl));

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
    if (!token.userId) throw invalidException('Token is not valid token type', 'TSM105');

    await updateUserFields(token.userId, { password });

    await deleteToken(tokenId);

    return Promise.resolve();
  } catch (err) {
    console.log(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};
