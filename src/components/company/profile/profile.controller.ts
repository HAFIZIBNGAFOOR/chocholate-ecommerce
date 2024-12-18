import { Request, Response, NextFunction } from 'express';
import { unauthorizedException } from '../../../utils/apiErrorHandler';
import { getCompanyByID, updateCompanyFields } from '../../../models/company';
import { getCurrentJST } from '../../../utils/dayjs';
import { updateUserFieldsId } from '../../../models/user';

export const getCompanyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get companyId in companyAuth.
    const { companyId } = req.user;

    //  Check whether companyId exists.
    if (!companyId) throw unauthorizedException('Company ID is not defined.');

    //  Get Club promotion page from club promotion collection.
    const company = await getCompanyByID(companyId);

    res.status(200).json({ success: true, data: { company } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateCompanyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // Get companyId in companyAuth
    const { companyId } = req.user;

    // checks whether companyId exists
    if (!companyId) throw unauthorizedException('Company ID is not defined.');

    // Get email, companyName, logoUrl, province, city, phoneNo, address, website, industry, promotion, isPublic and numOfEmployees in body
    
    const {
      email,
      companyName,
      logoUrl,
      province,
      city,
      phoneNo,
      address,
      website,
      industry,
      promotion,
      isPublic,
      numOfEmployees,
    } = req.body;

    // updates Company fields in Companies collection
    await updateCompanyFields(companyId, {
      companyName,
      logoUrl,
      province,
      city,
      address,
      phoneNo,
      website,
      industry,
      promotion,
      isPublic,
      numOfEmployees,
    });

    // updates user fields in users collection
    await updateUserFieldsId({ companyId }, { email });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const quitService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  Get companyId  and userId in companyAuth
    const { companyId, userId } = req.user;

    // checks whether companyId exists
    if (!companyId) throw unauthorizedException('Company ID is not defined.');

    // checks whether userId exists
    if (!userId) throw unauthorizedException('User ID is not defined.');

    // updates company fields in Companies collection
    await updateCompanyFields(companyId, {
      deletedAt: new Date(getCurrentJST()),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
