import { Request, Response, NextFunction } from 'express';
import { getCompaniesWithFilter } from '../../../models/company';
import {
  NewClubActivityDocument,
  NewClubMemberDocument,
  NewUserDocument,
  UpdateClubActivityDocument,
} from '../../../models/@types';
import { v4 as uuidv4 } from 'uuid';
import { getClubByID } from '../../../models/club';
import * as service from './clubMember.service';
import { dataNotExistException } from '../../../utils/apiErrorHandler';
import {
  addClubMember,
  deleteClubMember,
  getClubMember,
  getClubMemberUniqueData,
  getClubMembersByID,
  getClubMembersProfileByID,
  updateClubMemberFields,
} from '../../../models/clubMember';
import { getCurrentJST } from '../../../utils/dayjs';
import { getRandomId } from '../../../utils/getRandom';
import { generatePassword, generatedId } from '../../../utils/randomId';
import { handleResponse } from '../../../middleware/requestHandle';
import { updateUserFieldsId } from '../../../models/user';
import {
  addClubActivity,
  getClubActivitiesByID,
  getClubActivitiesClubByID,
  updateClubActivityFields,
} from '../../../models/clubActivity';
import { REGEXP_PASSWORD_WEAK } from '../../../constants/regexp';

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get clubId in clubAuth
    const { clubId } = req.user;

    // checks whether clubId exists
    if (!clubId) throw dataNotExistException('Club is not existing');

    // get grade, area, major, offset and limit in query
    const { grade, area, major, offset, limit } = req.query;

    // checks whether offset and limit exists
    if (!offset || !limit) throw new Error('1034');

    // create search with grade, area and major converting to string
    const search = {
      grade: grade?.toString(),
      area: area?.toString(),
      major: major?.toString(),
    };

    // get club members by club id and search query from clubmember collection
    const members = await getClubMembersByID(clubId, search, Number(limit), Number(offset));

    return res.status(200).json({ success: true, data: { members } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getMemberId = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get memberId in params 
    const { memberId } = req.params;

    // checks whether memberId exists 
    if (!memberId) throw dataNotExistException('memberId is not existing');

    // get clubmembers by id from Club members collection.
    const result = await getClubMembersProfileByID(memberId);
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get email, clubMemberName, imageUrl, hometown, grade and major in body
    const { email, clubMemberName, imageUrl, hometown, grade, major } = req.body;

    // get clubId in clubAuth
    const { clubId } = req.user;

    // checks whether clubId exists
    if (!clubId) throw dataNotExistException('Club is not existing');

    // get club by clubId from club collection
    const club = await getClubByID(clubId);

    // checks whether club exists
    if (!club) throw dataNotExistException('Club is not existing');

    // Creates new club member document 
    const newMember: NewClubMemberDocument = {
      clubMemberId: uuidv4(),
      clubId,
      universityId: club.universityId,
      clubMemberName,
      imageUrl,
      hometown,
      grade,
      major,
      personalTestResultUrl: null,
      deletedAt: null,
    };

    // create new user document 
    const newUser: NewUserDocument = {
      userId: uuidv4(),
      userType: 'clubMember',
      companyId: null,
      clubId: null,
      chatStatus: 'offline',
      status: 'active',

      clubMemberId: newMember.clubMemberId,
      email: email,
      password: generatePassword(REGEXP_PASSWORD_WEAK as RegExp),
      refreshToken: null,
      deletedAt: null,
    };

    // creates new club member using createClubMember service.
    await service.createClubMember(newUser, newMember);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateMember = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get memberId in params
    const { memberId } = req.params;

    // get clubMemberName, email, imageUrl, hometown, grade, major and personalTestResultUrl in body
    const { clubMemberName, email, imageUrl, hometown, grade, major, personalTestResultUrl } = req.body;

    // updates club member fields in Clubmember collection
    await updateClubMemberFields(memberId, {
      clubMemberName,
      imageUrl,
      hometown,
      grade,
      major,
      personalTestResultUrl,
    });

    // updates user fields in user collection
    await updateUserFieldsId({ clubMemberId: memberId }, { email });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get memberId in params 
    const { memberId } = req.params;

    // updates deletedAt field in clubMember collection to delete clubMember
    await deleteClubMember(memberId, {
      deletedAt: new Date(getCurrentJST()),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const getClubMemberUnique = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get fieldName in query
    const { fieldName } = req.query;

    // get clubId in clubAuth
    const { clubId } = req.user;

    // checks whether ClubId exists 
    if (!clubId) throw dataNotExistException('Club is not existing');

    // checks whether fieldName and ClubId exists 
    if (!fieldName || !clubId) throw new Error('1034');

    // get club members unique data from clubMember collection
    const result = await getClubMemberUniqueData(clubId, fieldName.toString());
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const addClubsActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get clubId in clubAuth
    const { clubId } = req.user;
    if (!clubId) throw dataNotExistException('Club is not existing');

    // get title, description, imageUrl and activityDate in body
    const { title, description, imageUrl, activityDate } = req.body;

    // creates new clubactivity document 
    const addClub: NewClubActivityDocument = {
      clubActivityId: generatedId(),
      clubId,
      title,
      description,
      imageUrl,
      activityDate,
      deletedAt: null,
    };

    // save new club activity document in clubActivity collection
    await addClubActivity(addClub);
    return handleResponse(res, 201, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateClubsActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubActivityId in params
    const { clubActivityId } = req.params;

    // get title, description, imageUrl and activityDate in body
    const { title, description, imageUrl, activityDate } = req.body;

    // creates a new clubActivity document 
    const update: UpdateClubActivityDocument = {
      title,
      description,
      imageUrl,
      activityDate,
    };

    // updates clubactivity document in club activity collection
    await updateClubActivityFields(clubActivityId, update);
    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteClubActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubActivityId in params 
    const { clubActivityId } = req.params;

    // creates deletedAt field in clubActivity document
    const clubActivityDelete: UpdateClubActivityDocument = {
      deletedAt: new Date(getCurrentJST()),
    };

    // updates clubAvitivity document in club activity collection
    await updateClubActivityFields(clubActivityId, clubActivityDelete);
    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubActivityByClubId = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get clubId in clubAuth
    const { clubId } = req.user;

    // checks whether clubId exists
    if (!clubId) throw dataNotExistException('Club is not existing');

    // get clubAcitivities by id from club activities collection
    const result = await getClubActivitiesClubByID(clubId);
    return handleResponse(res, 200, { data: { result } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubActivityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubActivityId in params
    const { clubActivityId } = req.params;

    // get club activities by id from clubactivities collection
    const result = await getClubActivitiesByID(clubActivityId);
    return handleResponse(res, 200, { data: { result } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
