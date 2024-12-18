import { Request, Response, NextFunction } from 'express';

import { getCompaniesWithFilter, getCompanyUniqueData } from '../../../models/company';
import { handleResponse } from '../../../middleware/requestHandle';

export const getCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get limit, offset in query 
    const { limit, offset } = req.query;

    // checks whether offset and limit exists
    if (!offset || !limit) throw new Error('1034');

    // get numOfEmployees, industry, province and search in query 
    const { numOfEmployees, industry, province, search } = req.query;

    // creates format with numOfEmployees, industry, province converted into string
    const format = {
      numOfEmployees: numOfEmployees?.toString(),
      industry: industry?.toString(),
      province: province?.toString(),
    };

    // get companies from companies collection
    const companies = await getCompaniesWithFilter(Number(limit), Number(offset), format, search?.toString());

    res.status(200).json({ success: true, data: { companies } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getCompaniesUniqueData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get fieldName in query
    const { fieldName } = req.query;

    // checks whether fieldName exists
    if (!fieldName) throw new Error('1031'); //TODO: field name is error
    // get companies unique data from companies Collection
    const result = await getCompanyUniqueData(fieldName.toString());
    return handleResponse(res, 200, { data: { result } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
