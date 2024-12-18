import { Schema } from 'express-validator';
import {
  VALIDATION_ARRAY,
  VALIDATION_BOOLEAN,
  VALIDATION_CLUB_ACTIVITY_ID,
  VALIDATION_CLUB_BLOG_ID,
  VALIDATION_CLUB_ID,
  VALIDATION_CLUB_MEMBER_ID,
  VALIDATION_CLUB_PROMO_PAGE_ID,
  VALIDATION_CLUB_SPONSOR_ID,
  VALIDATION_CLUB_SPONSOR_STATUS,
  VALIDATION_COMPANY_ID,
  VALIDATION_EMAIL_NOT_EXIST,
  VALIDATION_NUMBER,
  VALIDATION_PROMOTION_STRING,
  VALIDATION_PROMOTION_TITLE_STRING,
  VALIDATION_STRING,
  VALIDATION_UNIVERSITY_ID,
} from '../../../constants/validation';

export const GET_CLUB_MEMBER_SCHEMA: Schema = {
  clubId: VALIDATION_CLUB_ID('params'),
};

export const GET_CLUB_MEMBER_OFFSET_SCHEMA: Schema = {
  clubId: VALIDATION_CLUB_ID('params'),
  offset: VALIDATION_STRING('query'),
  limit: VALIDATION_STRING('query'),
};
export const GET_CLUB_MEMBER_UNIQUE_SCHEMA: Schema = {
  clubId: VALIDATION_CLUB_ID('params'),
  fieldName: VALIDATION_STRING('query'),
};

export const ADD_CLUB_MEMBER_SCHEMA: Schema = {
  clubId: VALIDATION_CLUB_ID('params'),
  email: VALIDATION_EMAIL_NOT_EXIST('body'),
  clubMemberName: VALIDATION_STRING('body'),
  imageUrl: VALIDATION_STRING('body'),
  hometown: VALIDATION_STRING('body'),
  grade: VALIDATION_STRING('body'),
  major: VALIDATION_STRING('body'),
  personalTestResultUrl: VALIDATION_STRING('body', 'optional'),
};

export const GET_CLUB_MEMBER_UPDATE_SCHEMA: Schema = {
  clubId: VALIDATION_CLUB_ID('params'),
  memberId: VALIDATION_CLUB_MEMBER_ID('params'),
};

export const GET_MEMBER_ID_SCHEMA: Schema = {
  memberId: VALIDATION_CLUB_MEMBER_ID('params'),
};

export const GET_CLUB_SCHEMA: Schema = {
  clubId: VALIDATION_CLUB_ID('params'),
};

export const GET_CLUBS_SCHEMA: Schema = {};

export const GET_CLUB_UNIQUE_SCHEMA: Schema = {
  fieldName: VALIDATION_STRING('query'),
};
export const CREATE_CLUB_SCHEMA: Schema = {
  universityId: VALIDATION_UNIVERSITY_ID('body'),
  clubName: VALIDATION_STRING('body'),
  imageUrl: VALIDATION_STRING('body'),
  website: VALIDATION_STRING('body'),
  category: VALIDATION_STRING('body'),
  isPublic: VALIDATION_BOOLEAN('body'),
  email: VALIDATION_EMAIL_NOT_EXIST('body'),
  title: VALIDATION_PROMOTION_TITLE_STRING('body', 'optional'),
  clubGoal: VALIDATION_PROMOTION_STRING('body', 'optional'),
  imageUrls: VALIDATION_ARRAY('body', 'optional'),
  reasonForSponsorship: VALIDATION_PROMOTION_STRING('body', 'optional'),
  returnForSponsorship: VALIDATION_STRING('body', 'optional'),
};

// TODO: // VALIDATION CLUB SPONSORS
export const ADD_CLUB_SPONSORS_SCHEMA: Schema = {
  clubId: VALIDATION_CLUB_ID('params'),
  companyId: VALIDATION_COMPANY_ID('params'),
  status: VALIDATION_CLUB_SPONSOR_STATUS('body'),
};

export const GET_CLUB_SPONSOR_SCHEMA: Schema = {
  clubId: VALIDATION_CLUB_ID('params'),
  companyId: VALIDATION_COMPANY_ID('params'),
};

export const GET_CLUB_ID_SCHEMA: Schema = {};
export const UPDATE_SPONSOR_SCHEMA: Schema = {
  clubSponsorId: VALIDATION_CLUB_SPONSOR_ID('params'),
  status: VALIDATION_CLUB_SPONSOR_STATUS('body'),
};
export const GET_CLUB_SPONSOR_ID_SCHEMA: Schema = {
  clubSponsorId: VALIDATION_CLUB_SPONSOR_ID('params'),
};

export const GET_CLUB_SPONSORS_SCHEMA: Schema = {
  offset: VALIDATION_NUMBER('query'),
  limit: VALIDATION_NUMBER('query'),
};

//TODO:   VALIDATION CLUB ACTIVITY

export const ADD_CLUB_ACTIVITY_SCHEMA: Schema = {
  clubId: VALIDATION_CLUB_ID('params'),
  title: VALIDATION_STRING('body'),
  description: VALIDATION_STRING('body'),
  imageUrl: VALIDATION_STRING('body'),
  activityDate: VALIDATION_STRING('body'),
};

export const GET_CLUB_ACTIVITY_ID_SCHEMA: Schema = {
  clubActivityId: VALIDATION_CLUB_ACTIVITY_ID('params'),
};

export const UPDATE_CLUB_ACTIVITY_SCHEMA: Schema = {
  clubActivityId: VALIDATION_CLUB_ACTIVITY_ID('params'),
  title: VALIDATION_STRING('body'),
  description: VALIDATION_STRING('body'),
  imageUrl: VALIDATION_STRING('body'),
  activityDate: VALIDATION_STRING('body'),
};

export const CREATE_CLUB_BLOG_SCHEMA: Schema = {
  publishDate: VALIDATION_STRING('body'),
  content: VALIDATION_STRING('body'),
  isShow: VALIDATION_BOOLEAN('body'),
};

export const UPDATE_CLUB_BLOG_SCHEMA: Schema = {
  clubBlogId: VALIDATION_CLUB_BLOG_ID('params'),
  publishDate: VALIDATION_STRING('body'),
  content: VALIDATION_STRING('body'),
  isShow: VALIDATION_BOOLEAN('body'),
};

export const GET_CLUB_BLOG_SCHEMA: Schema = {
  clubBlogId: VALIDATION_CLUB_BLOG_ID('params'),
};

export const GET_SCHEMA: Schema = {};

export const ADD_CLUB_PROMO_PAGE: Schema = {
  clubId: VALIDATION_CLUB_ID('body'),
  title: VALIDATION_STRING('body'),
  publishDate: VALIDATION_STRING('body'),
  content: VALIDATION_STRING('body'),
  thumbnail: VALIDATION_STRING('body'),
  isShow: VALIDATION_BOOLEAN('body'),
};

export const UPDATE_CLUB_PROMO_PAGE: Schema = {
  clubPromotionPageId: VALIDATION_CLUB_PROMO_PAGE_ID('params'),
  title: VALIDATION_STRING('body'),
  publishDate: VALIDATION_STRING('body'),
  content: VALIDATION_STRING('body'),
  thumbnail: VALIDATION_STRING('body'),
  isShow: VALIDATION_BOOLEAN('body'),
};

export const GET_CLUB_PROMO_PAGE_ID: Schema = {
  clubPromotionPageId: VALIDATION_CLUB_PROMO_PAGE_ID('params'),
};
