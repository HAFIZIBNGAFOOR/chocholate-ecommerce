import {
  badImplementationException,
  dataNotExistException,
  HttpException,
  invalidException,
} from '../../../utils/apiErrorHandler';
import { v4 as uuidv4 } from 'uuid';
import { getAddToCurrentJST } from '../../../utils/dayjs';
import {  MESSAGE_SEND_OTP } from './auth.message';
import { NewTokenDocument, NewUserDocument, UserDocument } from '../../../models/@types';
// import { addToken, deleteToken, getTokenByID } from '../../../models/token';
import { updateUserFields, getUserByEmail, addUser } from '../../../models/user';
import { sendMessage } from '../../../utils/sgMailer';
import { sentMail } from '../../../utils/nodemailer';
import { getRandomId } from '../../../utils/getRandom';
import { generatedId } from '../../../utils/randomId';

export const processLogin = async (email: string) => {
  try {
    // Step 1: Check if the user exists
    const user = await getUserByEmail(email);

    if (user) {
      // User exists: Generate and send OTP
      const otp = await getRandomId(6);
      await sentMail(MESSAGE_SEND_OTP(email, otp)); // Sends OTP to user's email
      await updateUserFields(user.id, { otp }); // Updates user record with OTP
      return true;
    } else {
      // Step 2: Create a new user and send OTP
      const user: NewUserDocument = {
        email,
        userId: generatedId(),
        userType: 'us',
        status: 'active',
        refreshToken: null,
        deletedAt: null,
      };
      const newUser = await addUser(user); // Creates a new user
      const otp = await getRandomId(6);
      await sentMail(MESSAGE_SEND_OTP(email, otp)); // Sends OTP to user's email
      await updateUserFields(user.userId, { otp }); // Updates user record with OTP
      return true;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error during login process.');
  }
};
