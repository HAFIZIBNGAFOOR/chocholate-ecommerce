import { Request, Response, NextFunction } from 'express';
import {
  deleteClubMember,
  getAllMemberArea,
  getAllMemberListGrade,
  getClubMemberUniqueData,
  getClubMembersByID,
  getClubMembersProfileByID,
  updateClubMemberFields,
} from '../../../models/clubMember';
import {
  getClubByID,
  getClubDetail,
  getClubsMemberCount,
  updateClubFields,
  getClubUnique,
  getClubList,
} from '../../../models/club';
import { v4 as uuidv4 } from 'uuid';
import * as service from './club.service';
import { dataNotExistException, unauthorizedException } from '../../../utils/apiErrorHandler';
import {
  NewClubActivityDocument,
  NewClubBlogDocument,
  NewClubDocument,
  NewClubMemberDocument,
  NewClubPromotionDocument,
  NewClubPromotionPageDocument,
  NewClubSponsorDocument,
  NewUserDocument,
  UpdateClubActivityDocument,
  UpdateClubBlogDocument,
  UpdateClubDocument,
  UpdateClubPromotionDocument,
  UpdateClubPromotionPageDocument,
  UpdateClubSponsorDocument,
} from '../../../models/@types';
import {
  addClubSponsor,
  getClubSponsorByIDs,
  getClubSponsorsByClubID,
  getClubSponsorsWithFilter,
  getSponsorsId,
  updateClubSponsorFields,
} from '../../../models/clubSponsor';
import { getCurrentJST } from '../../../utils/dayjs';
import { getRandomId } from '../../../utils/getRandom';
import { generatedId, generatePassword } from '../../../utils/randomId';
import { handleResponse } from '../../../middleware/requestHandle';
import {
  addClubActivity,
  getClubActivitiesByID,
  getClubActivitiesClubByID,
  updateClubActivityFields,
} from '../../../models/clubActivity';
import { updateUserFields, updateUserFieldsId } from '../../../models/user';
import { getClubPromotionByID, updateClubPromotionFields } from '../../../models/clubPromotion';
import { REGEXP_PASSWORD_WEAK } from '../../../constants/regexp';
import { addClubBlog, getClubBlogWithFilter, getClubBlogWithId, updateClubBlogFields } from '../../../models/clubBlog';
import {
  addClubPromotionPage,
  getClubPromotionPage,
  getClubPromotionPageById,
  updateClubPromotionPage,
} from '../../../models/clubPromotionPage';

export const getClubMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId in params 
    const { clubId } = req.params;

    // get grade, area, major, offset and limit in query
    const { grade, area, major, offset, limit } = req.query;

    // checks whether offset and limit exists 
    if (!offset || !limit) throw new Error('1034');

    // creates search with grade, area, major converting into string
    const search = {
      grade: grade?.toString(),
      area: area?.toString(),
      major: major?.toString(),
    };
    // get club members by id from CLub members collection
    const members = await getClubMembersByID(clubId, search, Number(limit), Number(offset));

    return res.status(200).json({ success: true, data: { members } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubMemberUnique = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get fieldName in query
    const { fieldName } = req.query;

    // get clubId in params 
    const { clubId } = req.params;

    // checks whether fieldName and clubId exists 
    if (!fieldName || !clubId) throw new Error('1034');

    // get club members unique data from club Member collection
    const result = await getClubMemberUniqueData(clubId, fieldName.toString());
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAClub = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //TODO: need aggregate function
    // get clubId in params 
    const { clubId } = req.params;

    // const results = await Promise.all([
    //   getClubByID(clubId),
    //   getClubMembersByID(clubId),
    //   getClubSponsorsByClubID(clubId),
    // ]);
    // const club = results[0];
    // const members = results[1];
    // const sponsors = results[2];

    // get club detail from club collection
    const club = await getClubDetail(clubId, true);

    return handleResponse(res,200,{club})
  } catch (err) {
    console.log(err);
    console.error(err);
    next(err);
  }
};

export const getClubs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get limit and offset in query
    const { limit, offset } = req.query;

    // get  universityName, numberOfMembers, universityProvince, category, noClubMemberFrom and noClubMemberTo in query
    const { universityName, numberOfMembers, universityProvince, category, noClubMemberFrom, noClubMemberTo } =
      req.query;

      // creates search query with universityName, numberOfMembers, universityProvince, category, noClubMemberFrom and noClubMemberTo converting into string
    const search = {
      universityName: universityName?.toString(),
      // numberOfMembers: Number(numberOfMembers?.toString()) || NaN,
      noClubMemberFrom: noClubMemberFrom?.toString(),
      noClubMemberTo: noClubMemberTo?.toString(),
      universityProvince: universityProvince?.toString(),
      category: category?.toString(),
    };

    // get clubs from getClubs service .
    const clubs = await service.getClubs(Number(limit) || 0, Number(offset) || 0, search);
    return res.status(200).json({ success: true, data: { clubs } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId in params 
    const { clubId } = req.params;

    // checks whether clubId exists 
    if (!clubId) throw unauthorizedException('Club ID is not defined.');

    // get club by id from club collection
    const club = await getClubByID(clubId);

    return res.status(200).json({ success: true, data: { club } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateClubProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId in params 
    const { clubId } = req.params;
    
    // checks whether clubId exists 
    if (!clubId) throw unauthorizedException('Club ID is not defined.');

    // get universityId clubName,imageUrl,website,category,email,title,imageUrls,clubGoal,isPublic,noClubMember,personalTestUrl,reasonForSponsorship,returnForSponsorship and memo in body
    const {
      universityId,
      clubName,
      imageUrl,
      website,
      category,
      title,
      imageUrls,
      clubGoal,
      isPublic,
      noClubMember,
      personalTestUrl,
      reasonForSponsorship,
      returnForSponsorship,
      memo,
    } = req.body;

    // creates new club document 
    const clubUpdate: UpdateClubDocument = {
      universityId,
      clubName,
      imageUrl,
      website,
      isPublic,
      personalTestUrl,
      noClubMember,
      memo,
      category,
    };

    // creates new updateClubPromotion document 
    const clubPromoUpdate: UpdateClubPromotionDocument = {
      title,
      clubGoal,
      reasonForSponsorship,
      returnForSponsorship,
      imageUrls,
    };

    console.log(clubPromoUpdate);

    // saves new club data using updateClub service
    await service.updateClub(clubId, clubUpdate, clubPromoUpdate);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const addClubMemberProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get email, clubMemberName, imageUrl, hometown, grade, major and personalTestResultUrl in body
    const { email, clubMemberName, imageUrl, hometown, grade, major, personalTestResultUrl } = req.body;

    // get clubId in params 
    const { clubId } = req.params;

    // get club by id from club collection
    const club = await getClubByID(clubId);

    // checks whether clubId exists 
    if (!club) throw dataNotExistException('Club is not existing');
    //console.log(club.universityId);

    // creates new club member document
    const newMember: NewClubMemberDocument = {
      clubMemberId: uuidv4(),
      clubId,
      universityId: club.universityId,
      clubMemberName,
      imageUrl,
      hometown,
      grade,
      major,
      personalTestResultUrl,
      deletedAt: null,
    };

    // creates new user document 
    const newUser: NewUserDocument = {
      userId: uuidv4(),
      userType: 'clubMember',
      companyId: null,
      clubId: null, // TODO: ClubId duplicated issues
      chatStatus: 'offline',
      status: 'active',

      clubMemberId: newMember.clubMemberId,
      email: email,
      password: generatePassword(REGEXP_PASSWORD_WEAK as RegExp),
      refreshToken: null,
      deletedAt: null,
    };

    // saves new user and club member using createClubMember service
    await service.createClubMember(newUser, newMember);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubMemberProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get memberId in params 
    const { memberId } = req.params;

    // get clubMember by id from clubmembers collection
    const getMember = await getClubMembersProfileByID(memberId);

    return res.status(200).json({ success: true, data: { getMember } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateClubMemberProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get memberId and clubId in params 
    const { memberId, clubId } = req.params;
    // get clubMemberName, imageUrl, hometown, grade, major and personalTestResultUrl  in body
    const { clubMemberName, imageUrl, hometown, grade, major, personalTestResultUrl } = req.body;

    // updates clubmember field in clubmember collection
    await updateClubMemberFields(memberId, {
      clubId,
      clubMemberName,
      imageUrl,
      hometown,
      grade,
      major,
      personalTestResultUrl,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteClubMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get memberId and clubId in params 
    const { memberId, clubId } = req.params;

    // updates deletedAt field in club member collection
    await deleteClubMember(memberId, {
      deletedAt: new Date(getCurrentJST()),
    });

    // update user field with status inactive and deletedAt field in user collection
    await updateUserFields(memberId, {
      status: 'Inactive',
      deletedAt: new Date(getCurrentJST()),
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createClub = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get universityId clubName,imageUrl,website,category,email,title,imageUrls,clubGoal,isPublic,noClubMember,personalTestUrl,reasonForSponsorship,returnForSponsorship and memo in body
    const {
      universityId,
      clubName,
      imageUrl,
      website,
      category,
      email,
      title,
      imageUrls,
      clubGoal,
      isPublic,
      noClubMember,
      personalTestUrl,
      reasonForSponsorship,
      returnForSponsorship,
      memo,
    } = req.body;

    // creates new club document
    const newClub: NewClubDocument = {
      clubId: uuidv4(),
      universityId,
      clubName,
      imageUrl,
      website,
      category,
      personalTestUrl,
      isPublic,
      noClubMember,
      memo,
      deletedAt: null,
    };

    // creates new user document
    const newUser: NewUserDocument = {
      userId: uuidv4(),
      userType: 'clubAdmin',
      companyId: null,
      clubId: newClub.clubId,
      chatStatus: 'offline',
      clubMemberId: uuidv4(),
      email: email,
      status: 'active',
      password: generatePassword(REGEXP_PASSWORD_WEAK as RegExp),
      refreshToken: null,
      deletedAt: null,
    };

    // creates new club promotion document 
    const newPromo: NewClubPromotionDocument = {
      clubPromotionId: uuidv4(),
      clubId: newClub.clubId,
      title,
      imageUrls,
      clubGoal,
      reasonForSponsorship,
      returnForSponsorship,
      deletedAt: null,
    };

    // creates new club using createClub service 
    await service.createClub(newClub, newUser, newPromo);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const suspendClub = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId in params 
    const { clubId } = req.params;

    // checks whether clubId exists 
    if (!clubId) throw unauthorizedException('Club ID is not defined.');

    // updates club fields with deletedAt field in club collection
    await updateClubFields(clubId, {
      deletedAt: new Date(getCurrentJST()),
    });

    // updates user fields with status and deletedAt field in user collection
    await updateUserFieldsId(
      { clubId },
      {
        status: 'Inactive',
        deletedAt: new Date(getCurrentJST()),
        refreshToken: null,
      },
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const addClubSponsors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get companyId and clubId in params 
    const { clubId, companyId } = req.params;

    // get status in body
    const { status } = req.body;

    // creates new club document 
    const addClub: NewClubSponsorDocument = {
      clubSponsorId: generatedId(),
      clubId,
      companyId,
      status,
      deletedAt: null,
    };

    // saves club sponsor in club sponsor collection
    await addClubSponsor(addClub);
    return handleResponse(res, 201, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateClubSponsors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubSponsorId in params 
    const { clubSponsorId } = req.params;

    // get status in body
    const { status } = req.body;

    // creates club sponsor update document 
    const update: UpdateClubSponsorDocument = {
      status,
    };

    // updates clubsponsors fields in club sponsor collection
    await updateClubSponsorFields(clubSponsorId, update);
    return handleResponse(res, 201, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubSponsors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get fieldName in query
    const { limit, offset, search } = req.query;

    // get clubs sponsors list from club sponsors collection
    const sponsors = await getClubSponsorsWithFilter(Number(limit) || 0, Number(offset) || 0, search?.toString());
    return handleResponse(res, 200, { data: { sponsors } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubSponsorByClubId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId in params 
    const { clubId } = req.params;

    // get club sponsor by club id from club sponsor collection
    const getClubSponsor = await getClubSponsorsByClubID(clubId);
    return handleResponse(res, 200, { data: { getClubSponsor } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubSponsorByClubIdAndCompanyId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId and companyId in params 
    const { clubId, companyId } = req.params;

    // get club sponsor by club id and company id from club sponsor collection
    const getClubSponsor = await getClubSponsorByIDs(clubId, companyId);
    return handleResponse(res, 200, { data: { getClubSponsor } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubSponsorOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubSponsorId in params 
    const { clubSponsorId } = req.params;

    // get sponsors by clubSponsors id from club sponsors 
    const result = await getSponsorsId(clubSponsorId);
    return handleResponse(res, 200, { data: { result } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

//TODO: Club Activity

export const addClubsActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
     // get clubId in params 
    const { clubId } = req.params;

    // get title, description, imageUrl and activityDate in body
    const { title, description, imageUrl, activityDate } = req.body;

    // creates new club activity document 
    const addClub: NewClubActivityDocument = {
      clubActivityId: generatedId(),
      clubId,
      title,
      description,
      imageUrl,
      activityDate,
      deletedAt: null,
    };

    // saves club activity in club activity collection
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

    // creates update club activity document 
    const update: UpdateClubActivityDocument = {
      title,
      description,
      imageUrl,
      activityDate,
    };

    // updates club activity document in clubActivity collection
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

    // creates update club activity document with deletedAt field 
    const clubActivityDelete: UpdateClubActivityDocument = {
      deletedAt: new Date(getCurrentJST()),
    };

    // updates club activity field in club activity collection
    await updateClubActivityFields(clubActivityId, clubActivityDelete);
    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const getClubActivityByClubId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId in params 
    const { clubId } = req.params;

    // get club activities by club id in club activity collection
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

    // get clubActivities by id from clubActivities collection
    const result = await getClubActivitiesByID(clubActivityId);
    return handleResponse(res, 200, { data: { result } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubMemberGrades = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId in params 
    const { clubId } = req.params;

    // get all members list gradeby clubId from clubMembers collection
    const result = await getAllMemberListGrade(clubId);
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const getClubMemberAreas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId in params 
    const { clubId } = req.params;

    // get allMembersArea by clubId from clubMembers collection 
    const result = await getAllMemberArea(clubId);
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubMemberCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get club members count from clubs collection
    const result = await getClubsMemberCount();
    return handleResponse(res, 200, { getClubMemberCount: result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubUniqueData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get fieldName in query
    const { fieldName } = req.query;

    // checks whether clubId exists 
    if (!fieldName) throw new Error('1031');

    // get unique club from clubs collections
    const result = await getClubUnique(fieldName.toString());
    return handleResponse(res, 200, { getClubUniqueField: result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get limit and offset in query
    const { limit, offset } = req.query;

    // get club blogs from clubBlog collections 
    const result = await getClubBlogWithFilter(Number(offset), Number(limit), true);
    return handleResponse(res, 200, { result });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getClubBlogGetOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubBlogId in params 
    const { clubBlogId } = req.params;
    console.log(clubBlogId);

    // get clubblog by id from clubBlog collection
    const result = await getClubBlogWithId(clubBlogId);
    return handleResponse(res, 200, { result });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createClubBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubBlogId in params 
    const { clubId } = req.params;

    // get content, title, publishDate and isShow in body
    const { content, title, publishDate, isShow } = req.body;

    // creates new club blog document 
    const createBlog: NewClubBlogDocument = {
      clubBlogId: generatedId(),
      title,
      publishDate,
      content,
      isShow,
      deletedAt: null,
    };

    // saves new club blog in clubBlog collection
    await addClubBlog(createBlog);

    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateClubBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubBlogId in params 
    const { clubBlogId } = req.params;

    // get content, title, publishDate and isShow in body
    const { content, title, publishDate, isShow } = req.body;
    const updateBlog: UpdateClubBlogDocument = {
      content,
      title,
      isShow,
      publishDate,
    };

    // updates clubc blog document in club blog document collection
    await updateClubBlogFields(clubBlogId, updateBlog);

    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteClubBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubBlogId in params 
    const { clubBlogId } = req.params;

    // creates update club blog document 
    const updateBlog: UpdateClubBlogDocument = {
      deletedAt: new Date(getCurrentJST()),
    };

    // update clubblog field in club blog collection
    await updateClubBlogFields(clubBlogId, updateBlog);

    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubAllList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get club lists from club lists collection 
    const result = await getClubList();
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const addClubPromoPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId, title, publishDate, content, thumbnail and isShow  in body
    const { clubId, title, publishDate, content, thumbnail, isShow } = req.body;

    // creates club promotion page document 
    const create: NewClubPromotionPageDocument = {
      clubPromotionPageId: generatedId(),
      clubId,
      title,
      publishDate,
      content,
      thumbnail,
      isShow,
      deletedAt: null,
    };

    // saves new club promotion in club promotion page collection
    await addClubPromotionPage(create);
    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateClubPromoPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubPromotionPageId in params 
    const { clubPromotionPageId } = req.params;

    // get title, publishDate, content, thumbnail and isShow in body
    const { title, publishDate, content, thumbnail, isShow } = req.body;

    // creates update club promotion document 
    const update: UpdateClubPromotionPageDocument = {
      title,
      publishDate,
      content,
      thumbnail,
      isShow,
    };
    // updates club promotion page in club promotion page collection
    await updateClubPromotionPage(clubPromotionPageId, update);
    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getClubPromoPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get fieldName in query
    const { offset, limit } = req.query;

    // get club promotion page from club promotion page collection
    const result = await getClubPromotionPage(Number(offset), Number(limit), true);
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getOneClubPromoPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubPromotionPageId in params 
    const { clubPromotionPageId } = req.params;

    // get club promotion page by id from club promotion page collection
    const result = await getClubPromotionPageById(clubPromotionPageId);
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteClubPromoPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubPromotionPageId in params 
    const { clubPromotionPageId } = req.params;

    // updates club promotion page by deleted at field in club promotion page collection
    await updateClubPromotionPage(clubPromotionPageId, { deletedAt: new Date(getCurrentJST()) });
    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};
