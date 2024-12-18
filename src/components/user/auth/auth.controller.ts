import { Request, Response, NextFunction } from 'express';
import { decodeJwt, encodeJwt } from '../../../utils/jwt';
import * as service from './auth.service';

import {
  badImplementationException,
  dataNotExistException,
  unauthorizedException,
} from '../../../utils/apiErrorHandler';
import { getUserByEmail, getUserByID, updateUserFields } from '../../../models/user';
import { handleResponse } from '../../../middleware/requestHandle';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //getUserId in userAuth
    const { userId } = req.user;
    //checks whether user exists
    if (!userId) throw badImplementationException('authorization process has something wrong.');
    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;

    //generated accessToken and refreshToken
    const accessToken = encodeJwt({ id: userId }, ACCESS_TOKEN_EXPIRED_IN || '1h', 'access');
    const refreshToken = encodeJwt({ id: userId }, REFRESH_TOKEN_EXPIRED_IN || '30d', 'refresh');
    //update new refreshToken in userCollection.
    await updateUserFields(userId, { refreshToken });
    return handleResponse(res,200,{accessToken,refreshToken})
  } catch (err) {
    console.error(err);
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
    return handleResponse(res,200,{})

  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //Get email in body.
    const { email } = req.body;

    //Get user from users collection.
    const user = await getUserByEmail(email);

    // Checks whether user exists and user is not deleted.
    if (!user) throw dataNotExistException('Email does not register');
    if (user.deletedAt) throw unauthorizedException('This user is deleted.');

    // sends mail with forgot password url in forgotPassword service.
    await service.forgotPassword(user);
    return handleResponse(res, 200, {})

  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //get password and tokenId in body
    const { password, tokenId } = req.body;

    //resets password using resetpassword service .
    await service.resetPassword(password, tokenId);

    return handleResponse(res, 200, {})
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

    return handleResponse(res, 200, {accessToken,refreshToken:newRefreshToken})
  } catch (err) {
    console.error(err);
    next(err);
  }
};
