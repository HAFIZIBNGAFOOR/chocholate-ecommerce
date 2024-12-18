import { Request, Response, NextFunction } from 'express';

import {
  getCompaniesWithFilter,
  getCompanyByID,
  getCompanyUniqueData,
  updateCompanyFields,
} from '../../../models/company';
import { v4 as uuidv4 } from 'uuid';
import { badImplementationException, unauthorizedException } from '../../../utils/apiErrorHandler';
import { getCurrentJST } from '../../../utils/dayjs';
import * as service from './company.service';
import { handleResponse } from '../../../middleware/requestHandle';
import { updateUserFields, updateUserFieldsId } from '../../../models/user';
import { NewCompanyDocument, NewUserDocument } from '../../../models/@types';
import { generatePassword } from '../../../utils/randomId';
import { REGEXP_PASSWORD_WEAK } from '../../../constants/regexp';
export const getCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get limit and offset in query
    const { limit, offset } = req.query;
    // get numOfEmployees, industry, province and search in query
    const { numOfEmployees, industry, province, search } = req.query;

    // creates format query with numOfEmployees, industry and province converting into string
    const format = {
      numOfEmployees: numOfEmployees?.toString(),
      industry: industry?.toString(),
      province: province?.toString(),
    };

    // get companies from companies collection
    const companies = await getCompaniesWithFilter(
      Number(limit) || 0,
      Number(offset) || 0,
      format,
      search?.toString(),
      true, // memo field is required
    );

    return res.status(200).json({ success: true, data: { companies } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getCompaniesById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get companyId in params
    const { companyId } = req.params;
    //checks whether companyId exists
    if (!companyId) throw new Error('1025');

    //get companies by id from companies collection
    const companies = await getCompanyByID(companyId);

    return res.status(200).json({ success: true, data: { companies } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get email,name,province,phoneNo,logoUrl,address,zipCode,industry,website,city,promotion,isPublic and numOfEmployees in body 
    const {
      email,
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

    // creates new company document 
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

    // creates new user document 
    const newUser: NewUserDocument = {
      userId: uuidv4(),
      userType: 'companyAdmin',
      chatStatus: 'offline',
      status: 'active',
      companyId: newCompany.companyId,
      clubId: null,
      clubMemberId: null,
      email,
      password: generatePassword(REGEXP_PASSWORD_WEAK as RegExp),
      refreshToken: null,
      deletedAt: null,
    };

    // creates company using createCompany service
    await service.createCompany(newUser, newCompany);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    console.error(err);
    next(err);
  }
};

export const updateCompanyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get companyId  in params
    const { companyId } = req.params;
    //checks whether companyId exists
    if (!companyId) throw unauthorizedException('1025');
    // get companyName email,name,province,logoUrl,address,zipCode,industry,website,city,promotion,isPublic and numOfEmployees in body 
    const {
      companyName,
      email,
      logoUrl,
      province,
      city,
      promotion,
      zipCode,
      numOfEmployees,
      address,
      website,
      industry,
      isPublic,
      memo,
    } = req.body;

    // updates company fields in Company Collection
    await updateCompanyFields(companyId, {
      companyName,
      logoUrl,
      province,
      city,
      address,
      promotion,
      zipCode,
      numOfEmployees,
      website,
      industry,
      isPublic,
      memo,
    });
    // updates user fields in User collection
    await updateUserFieldsId({ companyId }, { email });
    return handleResponse(res,200,{})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const suspendCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get companyId in params
    const { companyId } = req.params;
    //checks whether companyId exists
    if (!companyId) throw unauthorizedException('Company ID is not defined.');

    // updates compnay fields using suspendDeleted service
    await service.suspendDeleted(companyId);
    return handleResponse(res,200,{}) 
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getCompaniesUniqueData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get fieldName in query
    const { fieldName } = req.query;

    //checks whether fieldName exists
    if (!fieldName) throw new Error('1031'); //TODO: field name is error

    // get compay unique data from Company collection
    const result = await getCompanyUniqueData(fieldName.toString());
    return handleResponse(res, 200, { data: { result } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
