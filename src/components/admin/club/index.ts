import express, { Router } from 'express';
import { checkSchema } from 'express-validator';

import * as controller from './club.controller';

import { checkValidation } from '../../../utils/validation';
import {
  ADD_CLUB_ACTIVITY_SCHEMA,
  ADD_CLUB_MEMBER_SCHEMA,
  ADD_CLUB_PROMO_PAGE,
  ADD_CLUB_SPONSORS_SCHEMA,
  CREATE_CLUB_BLOG_SCHEMA,
  CREATE_CLUB_SCHEMA,
  GET_CLUBS_SCHEMA,
  GET_CLUB_ACTIVITY_ID_SCHEMA,
  GET_CLUB_BLOG_SCHEMA,
  GET_CLUB_ID_SCHEMA,
  GET_CLUB_MEMBER_OFFSET_SCHEMA,
  GET_CLUB_MEMBER_SCHEMA,
  GET_CLUB_MEMBER_UNIQUE_SCHEMA,
  GET_CLUB_MEMBER_UPDATE_SCHEMA,
  GET_CLUB_PROMO_PAGE_ID,
  GET_CLUB_SCHEMA,
  GET_CLUB_SPONSORS_SCHEMA,
  GET_CLUB_SPONSOR_ID_SCHEMA,
  GET_CLUB_SPONSOR_SCHEMA,
  GET_CLUB_UNIQUE_SCHEMA,
  GET_MEMBER_ID_SCHEMA,
  GET_SCHEMA,
  UPDATE_CLUB_ACTIVITY_SCHEMA,
  UPDATE_CLUB_BLOG_SCHEMA,
  UPDATE_CLUB_PROMO_PAGE,
  UPDATE_SPONSOR_SCHEMA,
} from './club.validation';
import { isAdmin } from '../../../utils/auth';

const router = express.Router();

router.get(
  '/:clubId/members',
  isAdmin,
  checkSchema(GET_CLUB_MEMBER_OFFSET_SCHEMA),
  checkValidation,
  controller.getClubMembers,
);
router.get(
  '/:clubId/members/unique',
  isAdmin,
  checkSchema(GET_CLUB_MEMBER_UNIQUE_SCHEMA),
  checkValidation,
  controller.getClubMemberUnique,
);

router.get(
  '/:clubId/members/grade',
  isAdmin,
  checkSchema(GET_CLUB_MEMBER_SCHEMA),
  checkValidation,
  controller.getClubMemberGrades,
);

router.get(
  '/:clubId/members/area',
  isAdmin,
  checkSchema(GET_CLUB_MEMBER_SCHEMA),
  checkValidation,
  controller.getClubMemberAreas,
);
router.get(
  '/members/:memberId',
  isAdmin,
  checkSchema(GET_MEMBER_ID_SCHEMA),
  checkValidation,
  controller.getClubMemberProfile,
);
router.put(
  '/:clubId/members/:memberId',
  isAdmin,
  checkSchema(GET_CLUB_MEMBER_UPDATE_SCHEMA),
  checkValidation,
  controller.updateClubMemberProfile,
);
router.delete(
  '/:clubId/members/:memberId',
  isAdmin,
  checkSchema(GET_MEMBER_ID_SCHEMA),
  checkValidation,
  controller.deleteClubMembers,
);
router.post(
  '/:clubId/members',
  isAdmin,
  checkSchema(ADD_CLUB_MEMBER_SCHEMA),
  checkValidation,
  controller.addClubMemberProfile,
);

router.post('/', isAdmin, checkSchema(CREATE_CLUB_SCHEMA), checkValidation, controller.createClub);
router.put('/:clubId/suspend', isAdmin, checkSchema(GET_CLUB_SCHEMA), checkValidation, controller.suspendClub);
router.get('/:clubId/profile', isAdmin, checkSchema(GET_CLUB_SCHEMA), checkValidation, controller.getAClub);
router.put('/:clubId/profile', isAdmin, checkSchema(GET_CLUBS_SCHEMA), checkValidation, controller.updateClubProfile);
router.get('/', isAdmin, checkSchema(GET_CLUBS_SCHEMA), checkValidation, controller.getClubs);
router.get('/clubList', isAdmin, checkSchema(GET_SCHEMA), checkValidation, controller.getClubAllList);

router.get('/clubMemberCount', isAdmin, checkSchema(GET_CLUBS_SCHEMA), checkValidation, controller.getClubMemberCount);
router.get(
  '/getClubUniqueData',
  isAdmin,
  checkSchema(GET_CLUB_UNIQUE_SCHEMA),
  checkValidation,
  controller.getClubUniqueData,
);

//TODO: ClubSponsors
router.post(
  '/clubSponsors/:clubId/:companyId/add',
  isAdmin,
  checkSchema(ADD_CLUB_SPONSORS_SCHEMA),
  checkValidation,
  controller.addClubSponsors,
);

router.get(
  '/clubSponsors/getAll',
  isAdmin,
  checkSchema(GET_CLUB_SPONSORS_SCHEMA),
  checkValidation,
  controller.getClubSponsors,
);

router.get(
  '/clubSponsors/:clubId/getAll',
  isAdmin,
  checkSchema(GET_CLUB_ID_SCHEMA),
  checkValidation,
  controller.getClubSponsorByClubId,
);

router.get(
  '/clubSponsors/:clubId/:companyId/getAll',
  isAdmin,
  checkSchema(GET_CLUB_SPONSOR_SCHEMA),
  checkValidation,
  controller.getClubSponsorByClubIdAndCompanyId,
);

router.get(
  '/clubSponsors/:clubSponsorId/getOne',
  isAdmin,
  checkSchema(GET_CLUB_SPONSOR_ID_SCHEMA),
  checkValidation,
  controller.getClubSponsorOne,
);

router.put(
  '/clubSponsors/:clubSponsorId/update',
  isAdmin,
  checkSchema(UPDATE_SPONSOR_SCHEMA),
  checkValidation,
  controller.updateClubSponsors,
);

//TODO: Club Activity
router.post(
  '/clubActivity/:clubId',
  isAdmin,
  checkSchema(ADD_CLUB_ACTIVITY_SCHEMA),
  checkValidation,
  controller.addClubsActivity,
);

router.get(
  '/clubActivity/:clubId/getAll',
  isAdmin,
  checkSchema(GET_CLUB_ID_SCHEMA),
  checkValidation,
  controller.getClubActivityByClubId,
);

router.get(
  '/clubActivity/:clubActivityId/getOne',
  isAdmin,
  checkSchema(GET_CLUB_ACTIVITY_ID_SCHEMA),
  checkValidation,
  controller.getClubActivityById,
);

router.put(
  '/clubActivity/:clubActivityId/update',
  isAdmin,
  checkSchema(UPDATE_CLUB_ACTIVITY_SCHEMA),
  checkValidation,
  controller.updateClubsActivity,
);

router.put(
  '/clubActivity/:clubActivityId/delete',
  isAdmin,
  checkSchema(GET_CLUB_ACTIVITY_ID_SCHEMA),
  checkValidation,
  controller.deleteClubActivity,
);

router.get('/clubBlog', isAdmin, checkSchema(GET_CLUB_SPONSORS_SCHEMA), checkValidation, controller.getClubBlog);
router.get(
  '/clubBlog/:clubBlogId/getOne',
  isAdmin,
  checkSchema(GET_CLUB_BLOG_SCHEMA),
  checkValidation,
  controller.getClubBlogGetOne,
);

router.post(
  '/clubBlog/create',
  isAdmin,
  checkSchema(CREATE_CLUB_BLOG_SCHEMA),
  checkValidation,
  controller.createClubBlog,
);

router.put(
  '/clubBlog/:clubBlogId/update',
  isAdmin,
  checkSchema(UPDATE_CLUB_BLOG_SCHEMA),
  checkValidation,
  controller.updateClubBlog,
);

router.put(
  '/clubBlog/:clubBlogId/delete',
  isAdmin,
  checkSchema(GET_CLUB_BLOG_SCHEMA),
  checkValidation,
  controller.deleteClubBlog,
);

router.post(
  '/clubPromoPage/create',
  isAdmin,
  checkSchema(ADD_CLUB_PROMO_PAGE),
  checkValidation,
  controller.addClubPromoPage,
);

router.put(
  '/clubPromoPage/:clubPromotionPageId/update',
  isAdmin,
  checkSchema(UPDATE_CLUB_PROMO_PAGE),
  checkValidation,
  controller.updateClubPromoPage,
);

router.put(
  '/clubPromoPage/:clubPromotionPageId/delete',
  isAdmin,
  checkSchema(GET_CLUB_PROMO_PAGE_ID),
  checkValidation,
  controller.deleteClubPromoPage,
);

router.get(
  '/clubPromoPage',
  isAdmin,
  checkSchema(GET_CLUB_SPONSORS_SCHEMA),
  checkValidation,
  controller.getClubPromoPage,
);

router.get(
  '/clubPromoPage/:clubPromotionPageId/getOne',
  isAdmin,
  checkSchema(GET_CLUB_PROMO_PAGE_ID),
  checkValidation,
  controller.getOneClubPromoPage,
);
export default router;
