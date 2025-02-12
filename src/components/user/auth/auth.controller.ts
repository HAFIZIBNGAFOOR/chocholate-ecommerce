import { Request, Response, NextFunction } from 'express';
import { decodeJwt, encodeJwt } from '../../../utils/jwt';
import * as service from './auth.service';

import {
  badImplementationException,
  dataNotExistException,
  invalidException,
  unauthorizedException,
} from '../../../utils/apiErrorHandler';
import { getProfileById, getUserByEmail, getUserByID, updateUserFields } from '../../../models/user';
import { handleResponse } from '../../../middleware/requestHandle';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, userType } = req.body;
    // Call the service
    if (userType == 'us') await service.userLogin(email);
    else {
      const admin = await getUserByEmail(email);
      if (!admin) throw invalidException('no user found','1110');
      if (admin.userType !== 'ad') throw invalidException('not an admin','1111');
      await service.adminLogin(email);
    }
    return handleResponse(res, 200, { success: true, message: 'OTP have send successfully to registered email' });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    const userId = await service.createUser(email);
    if (!userId) throw Error('1008');

    // Generate access and refresh tokens
    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;
    const accessToken = encodeJwt({ id: userId }, ACCESS_TOKEN_EXPIRED_IN || '1h', 'access');
    const refreshToken = encodeJwt({ id: userId }, REFRESH_TOKEN_EXPIRED_IN || '30d', 'refresh');
    // Update the user with the new refresh token
    await updateUserFields(userId, { refreshToken });
    const user = await getProfileById(userId);

    return handleResponse(res, 200, { accessToken, refreshToken, user });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //getUserId in userAuth
    const { userId } = req.user;

    //checks whether user
    if (!userId) throw badImplementationException('userId is not set properly');

    // update refreshToken with null in userCollection.
    await updateUserFields(userId, { refreshToken: null });
    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //get refreshToken in body
    const { refreshToken } = req.body;

    //Decodes refresh token and get user using decoded user id.
    const decoded = decodeJwt(refreshToken, 'refresh');
    const user = await getUserByID(decoded.payload.id);

    //Checks users exists, not deleted and valid refresh token exists
    if (!user) throw dataNotExistException('User is not exist');
    if (user.deletedAt) throw unauthorizedException('This user is deleted');
    if (user.refreshToken !== refreshToken) throw unauthorizedException('Refresh token is not valid');

    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;

    //Generate accessToken and refreshToken.
    const accessToken = encodeJwt({ id: user.userId }, ACCESS_TOKEN_EXPIRED_IN || '5m', 'access');
    const newRefreshToken = encodeJwt({ id: user.userId }, REFRESH_TOKEN_EXPIRED_IN || '30d', 'refresh');

    //Update user Collection with new refresh token.
    await updateUserFields(user.userId, { refreshToken: newRefreshToken });

    return handleResponse(res, 200, { accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
