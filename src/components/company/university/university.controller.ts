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

    // get limit, offset, province and  search in query.
    const { limit, offset, province, search } = req.query;

    // create format with province converting into string
    const format = {
      province: province?.toString(),
    };

    // get universities from university collection
    const universities = await getUniversitiesWithFilter(
      Number(limit) || 0,
      Number(offset) || 0,
      format,
      search?.toString(),
    );

    return res.status(200).json({ success: true, data: { universities } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const getUniversitiesAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get all unniversities from universities collection
    const universities = await getUniversity();

    return res.status(200).json({ success: true, data: { universities } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getUniversitiesById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get universityId in params.
    const { universityId } = req.params;

    // checks whether universityId exists
    if (!universityId) throw unauthorizedException('University ID is not defined.');

    // get universities by id from universities collection
    const universities = await getUniversityByID(universityId);

    return res.status(200).json({ success: true, data: { universities } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getUniversityUnique = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get fieldname in query 
    const { fieldName } = req.query;

    // checks whether fieldName exists 
    if (!fieldName) throw badImplementationException('1002');

    // get universities unique data from unniversities collection
    const result = await getUniversityUniqueData(fieldName.toString());
    return handleResponse(res, 200, { result });
  } catch (err) {
    next(err);
  }
};
