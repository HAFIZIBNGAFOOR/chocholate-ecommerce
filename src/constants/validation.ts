import { ParamSchema, Location } from 'express-validator';
import { getEmailOtp } from '../models/otp';
import { getProductById, getProductByName } from '../models/product';
// import {
//   EMAIL_MAX_LENGTH,
//   PASSWORD_MAX_LENGTH,
//   PASSWORD_MIN_LENGTH,
//   PR_CHAR_MIN_LENGTH,
//   PR_MAX_LENGTH,
//   PR_MIN_LENGTH,
// } from './length';
// import { getUserByEmail, getUserByID } from '../models/user';
// import { REGEXP_PASSWORD, REGEXP_PASSWORD_WEAK } from './regexp';
// import { comparePassword } from '../utils/bcrypt';
// import { setAdmin, setUser } from '../utils/helper';
// import { getTokenByID } from '../models/token';
// import { isAfterCurrentJST } from '../utils/dayjs';
// import { getAdminByEmail, getAdminByID } from '../models/admin';
// import { getClubByID, getClubMemberByID } from '../models/club';
// import { getDiscussionsById } from '../models/discussion';
// import { getMessageById } from '../models/message';
// import { getUniversitiesById } from '../components/admin/university/university.controller';
// import { getUniversityByID } from '../models/university';
// import { getCompanyByID } from '../models/company';
// import { getSponsorsId } from '../models/clubSponsor';
// import { getClubActivitiesByID } from '../models/clubActivity';
// import { TokenDocument, UserDocument } from '../models/@types';
// import { getClubBlogById } from '../models/clubBlog';
// import { getClubPromotionPageById } from '../models/clubPromotionPage';

export const VALIDATION_OTP = (where: Location): ParamSchema => ({
  in: [where],
  isNumeric: true,
  notEmpty: {
    errorMessage: '1005',
  },
  custom: {
    options: async (otp: string, { req }) => {
      // Retrieve the OTP record based on the email in the request body
      const { email } = req.body;
      if (!email) {
        throw new Error('1001');
      }

      const otpRecord = await getEmailOtp(email);
      if (!otpRecord) {
        throw new Error('1002');
      }

      // Check if OTP matches
      if (parseInt(otp, 10) !== otpRecord.otp) {
        throw new Error('1003');
      }

      // Check if OTP has expired
      if (new Date() > new Date(otpRecord.expiredAt)) {
        throw new Error('1004');
      }

      // Attach OTP record to the request object for use in the controller
      req.otp = otpRecord;
      return true;
    },
  },
});

export const VALIDATION_EMAIL_OTP = (where: Location): ParamSchema => ({
  in: ['body'],
  isEmail: {
    errorMessage: '1006',
  },
  notEmpty: {
    errorMessage: '1001.',
  },
  custom: {
    options: async (email: string) => {
      const otpRecord = await getEmailOtp(email);
      if (!otpRecord) {
        throw new Error('1007');
      }
      return true;
    },
  },
});

export const VALIDATION_EMAIL = (where: Location): ParamSchema => ({
  in: ['body'],
  isEmail: {
    errorMessage: '1006',
  },
  notEmpty: {
    errorMessage: '1001.',
  },
  custom: {
    options: async (value, { req }) => {
      const existingOtp = await getEmailOtp(value);

      if (existingOtp && new Date() < new Date(existingOtp.expiredAt)) {
        throw new Error('1009'); //A valid OTP already exists for this email.
      }
      req.existingOtp = existingOtp;
      return true;
    },
  },
});

export const VALIDATION_FILE_PATH = (where: Location): ParamSchema => ({
  in: [where],
  isArray: {
    errorMessage: 'File path must be an array with at least one item.',
  },
  custom: {
    options: (value, { req, location, path }) => {
      // Check if value is an array and has at least one item
      if (!Array.isArray(value) || value.length === 0) {
        console.log('File path must be an array with at least one item.');
        throw new Error('File path must be an array with at least one item.');
      }

      // Validate each item in the filePath array
      for (const item of value) {
        if (typeof item.fileName !== 'string' || !item.fileName) {
          console.log('Each filePath item must have a non-empty string fileName.');
          throw new Error('Each filePath item must have a non-empty string fileName.');
        }
        if (typeof item.contentType !== 'string' || !item.contentType) {
          console.log('Each filePath item must have a non-empty string contentType.');
          throw new Error('Each filePath item must have a non-empty string contentType.');
        }
      }

      return true; // Return true if all checks pass
    },
  },
});

export const VALIDATION_STRING = (
  where: 'body' | 'query' | 'params',
  subStatusCode: string,
  checkBy?: 'optional',
): ParamSchema => ({
  in: [where],
  isString: checkBy === 'optional' ? false : { errorMessage: subStatusCode },
  notEmpty: checkBy === 'optional' ? false : { errorMessage: subStatusCode },
  optional: checkBy === 'optional',
});

export const VALIDATION_NUTRITION_INFO = (where: 'body' | 'query' | 'params', subStatusCode: string): ParamSchema => ({
  in: [where],
  optional: true,
  isObject: { errorMessage: subStatusCode },
  custom: {
    options: (value) => {
      const { calories, sugar, fat, protein } = value || {};
      if (
        (calories && typeof calories !== 'number') ||
        (sugar && typeof sugar !== 'number') ||
        (fat && typeof fat !== 'number') ||
        (protein && typeof protein !== 'number')
      ) {
        throw new Error('1012'); // Invalid nutrition info
      }
      return true;
    },
  },
});

export const VALIDATION_RATINGS = (
  where: 'body' | 'query' | 'params',
  subStatusCode: string,
  checkBy?: 'optional',
): ParamSchema => ({
  in: [where],
  optional: true,
  isObject: checkBy === 'optional' ? false : { errorMessage: subStatusCode },
  custom: {
    options: (value) => {
      const { average, count } = value || {};
      if ((average && typeof average !== 'number') || (count && typeof count !== 'number')) {
        throw new Error('1019'); // Invalid ratings info
      }
      return true;
    },
  },
});

export const VALIDATION_BOOLEAN = (where: 'body' | 'query' | 'params', subStatusCode: string): ParamSchema => ({
  in: [where],
  isBoolean: { errorMessage: subStatusCode },
  notEmpty: true,
});

export const VALIDATION_NUMBER = (
  where: 'body' | 'query' | 'params',
  subStatusCode: string,
  checkBy?: 'optional',
): ParamSchema => ({
  in: [where],
  isNumeric: checkBy === 'optional' ? false : { errorMessage: subStatusCode },
  notEmpty: checkBy === 'optional' ? false : { errorMessage: subStatusCode },
  optional: checkBy === 'optional',
});

export const VALIDATION_ARRAY = (
  where: 'body' | 'query' | 'params',
  subStatusCode: string,
  checkBy?: 'optional',
  itemValidation?: { isString?: boolean },
): ParamSchema => ({
  in: [where],
  isArray: checkBy === 'optional' ? false : { errorMessage: subStatusCode },
  notEmpty: checkBy === 'optional' ? false : { errorMessage: subStatusCode },
  optional: checkBy === 'optional',
  custom: {
    options: (value) => {
      if (Array.isArray(value)) {
        if (itemValidation?.isString) {
          value.forEach((item) => {
            if (typeof item !== 'string') throw new Error(subStatusCode); // Invalid array item type
          });
        }
      }
      return true;
    },
  },
});

export const VALIDATION_ENUM = (
  where: 'body' | 'query' | 'params',
  allowedValues: string[],
  subStatusCode: string,
  checkBy?: 'optional',
): ParamSchema => ({
  in: [where],
  isString: checkBy === 'optional' ? false : { errorMessage: subStatusCode },
  notEmpty: checkBy === 'optional' ? false : { errorMessage: subStatusCode },
  custom: {
    options: (value) => {
      if (!allowedValues.includes(value)) throw new Error(subStatusCode); // Invalid enum value
      return true;
    },
  },
});

export const VALIDATION_PRODUCT_ID = (where: Location): ParamSchema => ({
  in: [where],
  isString: { errorMessage: '1080' },
  custom: {
    options: async (value, { req, location, path }) => {
      console.log(value);
      const activity = await getProductById(value);
      if (!activity) throw new Error('1080');
      return true;
    },
  },
});

export const VALIDATION_OBJECT = (where: Location, errorMessage: string, checkBy?: 'optional') => ({
  in: [where],
  notEmpty: checkBy === 'optional' ? false : { errorMessage },
  optional: checkBy === 'optional',
  custom: {
    options: (value: any) => {
      try {
        if (typeof value === 'string') {
          // Attempt to parse the string as JSON
          const parsed = JSON.parse(value);
          if (typeof parsed === 'object' && parsed !== null) {
            return true;
          }
        } else if (typeof value === 'object' && value !== null) {
          // Value is already an object
          return true;
        }
        throw new Error();
      } catch (error) {
        throw new Error(errorMessage);
      }
    },
  },
  errorMessage,
});

export const VALIDATION_PRODUCT_NAME = (where: Location, errorMessage: string): ParamSchema => ({
  in: [where],
  isString: { errorMessage },
  custom: {
    options: async (value, { req, location, path }) => {
      const activity = await getProductByName(value);
      if (!activity) throw new Error(errorMessage);
      return true;
    },
  },
});

export const VALIDATION_USER_TYPE = (where: Location): ParamSchema => ({
  in: [where],
  isIn: {
    options: [['us', 'ad']], // Enum values for userType
    errorMessage: '1010', // Error code for invalid userType
  },
  notEmpty: {
    errorMessage: '1001', // Error code for empty field
  },
});
