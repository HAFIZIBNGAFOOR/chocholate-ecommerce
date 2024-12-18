import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as service from './member.service';
import { NewAdminDocument } from '../../../models/@types';
import { unauthorizedException } from '../../../utils/apiErrorHandler';
import { getCurrentJST } from '../../../utils/dayjs';
import { getAdminByID, getAdminsWithFilter, updateAdminFields } from '../../../models/admin';
import { handleResponse } from '../../../middleware/requestHandle';

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get limit and offset in query 
    const { limit, offset } = req.query;

    // get members from admin collection
    const members = await getAdminsWithFilter(Number(limit) || 0, Number(offset) || 0);
    return handleResponse(res,200,{members})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getMembersById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get adminId in params 
    const { adminId } = req.params;

    // get member by adminId from admin Collection
    const members = await getAdminByID(adminId);

    return handleResponse(res,200,{members})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get email and password in body
    const { email, password } = req.body;

    // creates new admin document 
    const newAdmin: NewAdminDocument = {
      adminId: uuidv4(),
      email,
      privilege: 'general',
      password,
      refreshToken: '',
      deletedAt: null,
    } as any;

    // saves admin using createAdmin service
    await service.createAdmin(newAdmin);
    return handleResponse(res,200,{})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get adminId in params
    const { adminId } = req.params;
    // checks adminId exists 
    if (!adminId) throw unauthorizedException('Admin ID is not defined.');

    // get email , password, adminType in body
    const { email, password, adminType } = req.body;

    // updates adminFields in Admin collection
    await updateAdminFields(adminId, {
      email,
      privilege: adminType,
      password,
    });
    return handleResponse(res,200,{})

  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get adminId in params
    const { adminId } = req.params;
    // checks adminId exists 
    if (!adminId) throw unauthorizedException('admin ID is not defined.');

    // updates admin fields with deletedAt field in admin Collection
    await updateAdminFields(adminId, {
      deletedAt: new Date(getCurrentJST()),
    });
    
    return handleResponse(res,200,{})
  } catch (err) {
    console.error(err);
    next(err);
  }
};
