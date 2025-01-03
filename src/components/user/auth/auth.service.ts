import {
  badImplementationException,
  dataNotExistException,
  HttpException,
  invalidException,
} from '../../../utils/apiErrorHandler';
import { v4 as uuidv4 } from 'uuid';
import { getAddToCurrentJST } from '../../../utils/dayjs';
import { MESSAGE_SEND_OTP } from './auth.message';
import { NewOtpDocument, NewTokenDocument, NewUserDocument, UserDocument } from '../../../models/@types';
// import { addToken, deleteToken, getTokenByID } from '../../../models/token';
import { updateUserFields, getUserByEmail, addUser } from '../../../models/user';
import { sendMessage } from '../../../utils/sgMailer';
import { sentMail } from '../../../utils/nodemailer';
import { getRandomId } from '../../../utils/getRandom';
import { generatedId, randomNumber } from '../../../utils/randomId';
import { addOtp, deleteOtp } from '../../../models/otp';
import { Users } from '../../../models/user/user.entity';
import { encodeJwt } from '../../../utils/jwt';

export const processLogin = async (email: string) => {
  try {
    // Step 2: Create a new user and send OTP

    const otpDoc: NewOtpDocument = {
      otpId: generatedId(),
      email,
      userId: null,
      otp: Number(randomNumber(6, 'numeric')),
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
    };
    await addOtp(otpDoc); // Creates a new user
    await sentMail(MESSAGE_SEND_OTP(email, otpDoc.otp)); // Sends OTP to user's email
    return true;
  } catch (error) {
    console.error(error);
    throw new Error('Error during login process.');
  }
};

export const createUser = async (email: string) => {
  try {
    let user = await getUserByEmail(email);

    if (!user) {
      // Create a new user if not exists
      const userDoc: NewUserDocument = {
        userId: generatedId(), // Generate a unique ID for the user
        email,
        userType: 'us',
        status: 'active', // Default status
        username: email.split('@')[0],
        refreshToken: null,
        deletedAt: null,
      };
      user = await addUser(userDoc);
    }

    // Clean up OTP after successful verification
    await deleteOtp(email, 'email');

    return user.userId;
  } catch (err) {
    Promise.reject(err);
  }
};
