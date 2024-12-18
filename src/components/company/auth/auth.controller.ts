import { Request, Response, NextFunction } from 'express';
import * as service from './auth.service';
import { v4 as uuidv4 } from 'uuid';
import { NewCompanyDocument, NewUserDocument } from '../../../models/@types';
import { getUserByEmail } from '../../../models/user';
import { dataConflictException, dataNotExistException, invalidException } from '../../../utils/apiErrorHandler';
import { getTokenByID } from '../../../models/token';
import { handleResponse } from '../../../middleware/requestHandle';

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get tokenId in params.
    const { tokenId } = req.params;
    console.log(tokenId);

    //  Get token by tokenId from token collection . 
    const token = await getTokenByID(tokenId);

    //  Checks token exists.
    if (!token) throw invalidException('token does not exits', '1008');

    //  Checks token is valid and expected tokenType .
    if (token.tokenType !== 'registration') throw invalidException('Token is not valid token type', '1030'); // TODO: 1030 Token type not match
    return handleResponse(res,200,{email:token?.email})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //  Get tokenId,password, name, province, phoneNo, logoUrl, address, zipCode,industry, website, city, promotion, isPublic and numOfEmployees in body. 
    const {
      tokenId,
      password,
      name,
      province,
      phoneNo,
      logoUrl,
      address,
      zipCode,
      industry,
      website,
      city,
      promotion,
      isPublic,
      numOfEmployees,
    } = req.body;

    //  Get token by tokenId from token collection.
    const token = await getTokenByID(tokenId);

    //  Checks token exists.
    if (!token) throw dataNotExistException('Token does not exist');

    //Checks token is valid and expected tokenType. 
    if (token.tokenType !== 'registration') throw invalidException('Token is not valid token type', '1030');

    //  Checks is expected mail.
    if (!token.email) throw invalidException('Token is not valid token type', 'TSM105');

    //  Creates new company document and user document.
    const newCompany: NewCompanyDocument = {
      companyId: uuidv4(),
      logoUrl,
      companyName: name,
      province,
      city,
      numOfEmployees,
      address,
      zipCode,
      phoneNo,
      industry,
      website,
      promotion,
      isPublic,
      deletedAt: null,
    };
    const newUser: NewUserDocument = {
      userId: uuidv4(),
      userType: 'companyAdmin',
      chatStatus: 'offline',
      status: 'active',
      companyId: newCompany.companyId,
      clubId: null,
      clubMemberId: null,
      email: token.email,
      password,
      refreshToken: null,
      deletedAt: null,
    };

    //  Saves company documnet and user document using createCompany service.
    await service.createCompany(newUser, newCompany, tokenId);
    return handleResponse(res,200,{})
  } catch (err) {
    console.log(err);
    console.error(err);
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get email in body.
    const { email } = req.body;

    //  Get user by email from users collection.
    const user = await getUserByEmail(email);

    //  Checks user exists.
    if (user) throw dataConflictException('Email is already registered');

    //  Verify mail using verifyMail service.
    await service.verifyEmail(email);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
