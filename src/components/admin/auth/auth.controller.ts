import { Request, Response, NextFunction } from 'express';
import * as service from './auth.service';
import { v4 as uuidv4 } from 'uuid';
import {
  badImplementationException,
  dataNotExistException,
  unauthorizedException,
} from '../../../utils/apiErrorHandler';
import { decodeJwt, encodeJwt } from '../../../utils/jwt';
import { getAdminByEmail, getAdminByID, updateAdminFields } from '../../../models/admin';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get email and password in body
    const { email, password } = req.body;

    // creates new admin document 
    const newAdmin: any = {
      adminId: uuidv4(),
      privilege: 'superAdmin',
      email: email,
      password,
      refreshToken: '',
      createdAt: new Date(),
      updatedAt: null,
    };

    // saves new admin in users Collection using create admin service
    await service.createAdmin(newAdmin);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    console.error(err);
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get adminId , email and adminType in adminAuth
    const { adminId, email, adminType } = req.admin;

    // checks whether adminId, email and adminType exists 
    if (!adminId || !email || !adminType)
      throw badImplementationException('authorization process has something wrong.');

    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;

    //  creates accessToken and refreshToken using encodeJwt method
    const accessToken = encodeJwt({ id: adminId }, ACCESS_TOKEN_EXPIRED_IN || '5m', 'access');
    const refreshToken = encodeJwt({ id: adminId }, REFRESH_TOKEN_EXPIRED_IN || '30d', 'refresh');

    // update adminField with new refresh token
    await updateAdminFields(adminId, { refreshToken });

    return res.status(200).json({ success: true, adminType, accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get adminId in adminAuth
    const { adminId } = req.admin;
    // checks whether adminId exists 
    if (!adminId) throw badImplementationException('userId is not set properly');

    // update adminFields with null refreshToken
    await updateAdminFields(adminId, { refreshToken: null });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get email in body
    const { email } = req.body;

    // get admin by mail from users collection
    const admin = await getAdminByEmail(email);
    // checks whether admin exists 
    if (!admin) throw dataNotExistException('Email does not register');

    // calls forgot password service
    await service.forgotPassword(admin);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get password and tokenId in body
    const { password, tokenId } = req.body;

    // call resetPassword to update new password
    await service.resetPassword(password, tokenId);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get refreshToken in body
    const { refreshToken } = req.body;

    // decodes refresh token and get adminId
    const decoded = decodeJwt(refreshToken, 'refresh');

    // get admin details by adminId from users collection 
    const admin = await getAdminByID(decoded.payload.id);
    // checks whether admin exists
    if (!admin) throw dataNotExistException('User is not exist');
    // checks whether admin token is valid
    if (admin.refreshToken !== refreshToken) throw unauthorizedException('Refresh token is not valid');

    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;

    // creates new accessToken and refreshToken
    const accessToken = encodeJwt({ id: admin.adminId }, ACCESS_TOKEN_EXPIRED_IN || '5m', 'access');
    const newRefreshToken = encodeJwt({ id: admin.adminId }, REFRESH_TOKEN_EXPIRED_IN || '30d', 'refresh');

    // update adminFields with new refreshToken
    await updateAdminFields(admin.adminId, { refreshToken: newRefreshToken });

    return res.status(200).json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
