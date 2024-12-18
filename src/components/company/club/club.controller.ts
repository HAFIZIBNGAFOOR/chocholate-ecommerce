import { Request, Response, NextFunction } from 'express';
import * as service from './club.service';
import { v4 as uuidv4 } from 'uuid';
import { NewClubSponsorDocument, NewCompanyDocument, NewContractFormDocument } from '../../../models/@types';
import { dataNotExistException, unauthorizedException } from '../../../utils/apiErrorHandler';

import { getClubDetail, getClubUnique, supportList } from '../../../models/club';
import { getClubMemberUniqueData, getClubMembersByID } from '../../../models/clubMember';
import { getClubAdmin } from '../../../models/user';
import { handleResponse } from '../../../middleware/requestHandle';
import { getClubActivitiesByID, getClubActivitiesClubByID } from '../../../models/clubActivity';
import { addClubSponsor, clubSponsorCheckCompanyId } from '../../../models/clubSponsor';
import { getClubBlogWithFilter, getClubBlogWithId } from '../../../models/clubBlog';
import { CONTRACT_MESSAGE } from './club.message';
import { sentMail } from '../../../utils/nodemailer';
import { addContract } from '../../../models/contractForm';
import { generatedId } from '../../../utils/randomId';
import { getClubPromotionPage, getClubPromotionPageById } from '../../../models/clubPromotionPage';

export const getClubMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get clubId in params and grade, area, major,limit and offset in query.
    const { clubId } = req.params;
    const { grade, area, major, limit, offset } = req.query;
    if (!offset || !limit) throw new Error('1034');

    // Creates serach query by converting grade, area and major to string . 
    const search = {
      grade: grade?.toString(),
      area: area?.toString(),
      major: major?.toString(),
    };
    // Get Club members by id from ClubMembers collection.
    const members = await getClubMembersByID(clubId, search, Number(limit), Number(offset));

    return handleResponse(res,200,{ members })
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubMemberUnique = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //   Get clubId in params and fieldName in query.
    const { fieldName } = req.query;
    const { clubId } = req.params;

    // Checks fieldName and clubId exists .
    if (!fieldName || !clubId) throw new Error('1034');

    // Get Club members unique data  by Club id from ClubMembers collection.
    const result = await getClubMemberUniqueData(clubId, fieldName.toString());
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAClub = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get clubId in params and companyId in companyAuth.
    const { companyId } = req.user;
    const { clubId } = req.params;

    //  Checks companyId exits. 
    if (!companyId) throw unauthorizedException('Company ID is not defined.');

    // Get Club details from Club Collection.
    const club = await getClubDetail(clubId);

    // Get Club Admin by Id from Users Collection.
    const clubAdmin = await getClubAdmin(clubId);

    // Get Club Sponsor from clubSponsor Collection.
    const clubSponsor = await clubSponsorCheckCompanyId(companyId, clubId);

    return handleResponse(res,200,{ club, clubAdmin, clubSponsor : clubSponsor ? clubSponsor.status : null })
  
  } catch (err) {
    console.log(err);
    console.error(err);
    next(err);
  }
};

export const getAClubPublic = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get clubId in params.
    const { clubId } = req.params;

    // Get Club details from Club Collection.
    const club = await getClubDetail(clubId);

    //  Get Club Admin by Id from Users Collection.
    const clubAdmin = await getClubAdmin(clubId);

    return handleResponse(res,200,{club,clubAdmin})

  } catch (err) {
    console.log(err);
    console.error(err);
    next(err);
  }
};

export const getClubs = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //  Get limit, offset, universityName, numberOfMembers, universityProvince, category, noClubMemberFrom, noClubMemberTo in query.
    const { limit, offset } = req.query;
    const { universityName, numberOfMembers, universityProvince, category, noClubMemberFrom, noClubMemberTo } =
      req.query;

    // Creates search query with universityName, universityProvince, category, noClubMemberFrom, noClubMemberTo to string.
    const search = {
      universityName: universityName?.toString(),
      noClubMemberFrom: noClubMemberFrom?.toString(),
      noClubMemberTo: noClubMemberTo?.toString(),
      universityProvince: universityProvince?.toString(),
      category: category?.toString(),
      isPublic: true,
    };

    // Get clubs from getClubs service.
    const clubs = await service.getClubs(Number(limit), Number(offset), search);

    return handleResponse(res,200,{clubs})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubUniqueData = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get fieldName in query.
    const { fieldName } = req.query;

    //  Checks whether fieldName exists.
    if (!fieldName) throw new Error('1031');

    //  Get Unique Club from Clubs Collection.
    const result = await getClubUnique(fieldName.toString());
    return handleResponse(res, 200, { getClubUniqueField: result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const sendOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  Get companyId in companyAuth. 
    const { companyId } = req.user;

    // Get clubId in params.
    const { clubId } = req.params;

    //  Checks whether companyId exists.
    if (!companyId) throw unauthorizedException('This is not company account.');

    //  Get ClubSponsor from ClubSponsor Collection.
    const clubSponsor = await clubSponsorCheckCompanyId(companyId, clubId);

    // Creates new clubSponsor Document from ClubSponsor Collection.
    const newSponsorship: NewClubSponsorDocument = {
      clubSponsorId: uuidv4(),
      clubId,
      companyId,
      status: 'offer',
      deletedAt: null,
    };

    //  Saves clubSponsor using sendOffer service.
    await service.sendOffer(clubSponsor, newSponsorship);
    return handleResponse(res,200,{})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getSupportList = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get companyId in companyAuth.
    const { companyId } = req.user;

    //  Get limit, offset, status and search in query.
    const { limit, offset } = req.query;
    const { status } = req.query;
    const { search } = req.query;

    //  Checks whether companyId exists.
    if (!companyId) throw unauthorizedException('This is not company account.');

    //  Get supportList from club sponsors collection.
    const result = await supportList(companyId, Number(limit), Number(offset), status?.toString(), search?.toString());
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubActivityByClubId = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get clubId in params.
    const { clubId } = req.params;

    // Get Club activities from clubActivities collection.
    const result = await getClubActivitiesClubByID(clubId);
    return handleResponse(res, 200, { data: { result } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubActivityById = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get clubActivityId in params.
    const { clubActivityId } = req.params;

    // Get Club activity from clubActivities collection.
    const result = await getClubActivitiesByID(clubActivityId);
    return handleResponse(res, 200, { data: { result } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //  Get offset and limit in query.
    const { limit, offset } = req.query;

    //  Get Club blog from Club Blog collection.
    const result = await getClubBlogWithFilter(Number(offset), Number(limit), false);
    return handleResponse(res, 200, { result });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getClubBlogGetOne = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get clubBlogId in params.
    const { clubBlogId } = req.params;

    //  Get Club blog from Club Blog collection.
    const result = await getClubBlogWithId(clubBlogId);
    return handleResponse(res, 200, { result });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const contractForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //   Get  email, content, title and name in body.
    const { email, content, title, name } = req.body;

    //  Creates new contract document.
    const contract: NewContractFormDocument = {
      contractId: generatedId(),
      title,
      name,
      email,
      content,
      deletedAt: null,
    };

    //  Saves contract in contract form collection.
    await addContract(contract);

    //  Sends mail to contract email.
    await sentMail(CONTRACT_MESSAGE(name, title, email, content));
    return handleResponse(res, 200, {});
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getClubPromoPage = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get  offset and limit in query.
    const { offset, limit } = req.query;

    //  Get Club promotions page from club promotion collection.
    const result = await getClubPromotionPage(Number(offset), Number(limit), false);
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getOneClubPromoPage = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get clubPromotionPageId in params.
    const { clubPromotionPageId } = req.params;

    //  Get Club promotion page from club promotion collection.
    const result = await getClubPromotionPageById(clubPromotionPageId);
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
