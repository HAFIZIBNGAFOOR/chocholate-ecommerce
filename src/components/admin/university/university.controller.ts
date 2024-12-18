import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as service from './university.service';
import {
  getUniversitiesWithFilter,
  getUniversity,
  getUniversityByID,
  getUniversityUniqueData,
  updateUniversityFields,
} from '../../../models/university';
import { NewUniversityDocument } from '../../../models/@types';
import { badImplementationException, unauthorizedException } from '../../../utils/apiErrorHandler';
import { getCurrentJST } from '../../../utils/dayjs';
import { handleResponse } from '../../../middleware/requestHandle';

export const getUniversities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get limit, offset , province and search in query.
    const { limit, offset, province, search } = req.query;
    // create format with province converting to string
    const format = {
      province: province?.toString(),
    };
    // get univertsities from universities collection
    const universities = await getUniversitiesWithFilter(
      Number(limit) || 0,
      Number(offset) || 0,
      format,
      search?.toString(),
    );

    return handleResponse(res,200,{universities})
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const getUniversitiesAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get all universities from university collection
    const universities = await getUniversity();
    return handleResponse(res,200,{universities})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getUniversitiesById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get universityId in params 
    const { universityId } = req.params;
    // check whether universityId exists 
    if (!universityId) throw unauthorizedException('University ID is not defined.');

    // get universities by id from univeristy collection
    const universities = await getUniversityByID(universityId);

    return handleResponse(res,200,{universities})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createUniversity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get universityName, province, city, address, website, logoUrl and universityType in body
    const { universityName, province, city, address, website, logoUrl, universityType } = req.body;

    // creates new university document 
    const newUniversity: NewUniversityDocument = {
      universityId: uuidv4(),
      logoUrl,
      universityName,
      province,
      city,
      address,
      universityType,
      website,
      deletedAt: null,
    };

    // saves university using createUniversity service
    await service.createUniversity(newUniversity);

    return handleResponse(res,200,{})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateUniversity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get universityId in params
    const { universityId } = req.params;

    // checks whether universityId exists 
    if (!universityId) throw unauthorizedException('University ID is not defined.');

    const { universityName, logoUrl, province, city, address, website, universityType } = req.body;

    // updates university fields in University collection
    await updateUniversityFields(universityId, {
      logoUrl,
      universityName,
      province,
      city,
      address,
      universityType,
      website,
    });
    return handleResponse(res,200,{})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteUniversity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get universityId in params
    const { universityId } = req.params;

    // checks whether universityId exists
    if (!universityId) throw unauthorizedException('University ID is not defined.');

    // updates university field by deletedAt field
    await updateUniversityFields(universityId, {
      deletedAt: new Date(getCurrentJST()),
    });
    return handleResponse(res,200,{})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getUniversityUnique = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get fieldName in query
    const { fieldName } = req.query;

    // checks whether fieldName exists
    if (!fieldName) throw badImplementationException('1002');

    // get university unique data from university collection
    const result = await getUniversityUniqueData(fieldName.toString());
    return handleResponse(res, 200, { result });
  } catch (err) {
    // console.error(err);
    next(err);
  }
};
