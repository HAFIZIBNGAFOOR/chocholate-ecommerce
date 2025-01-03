import { ParamSchema, Location } from 'express-validator';
import { getEmailOtp } from '../models/otp';
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
        throw new Error('File path must be an array with at least one item.');
      }

      // Validate each item in the filePath array
      for (const item of value) {
        if (typeof item.fileName !== 'string' || !item.fileName) {
          throw new Error('Each filePath item must have a non-empty string fileName.');
        }
        if (typeof item.contentType !== 'string' || !item.contentType) {
          throw new Error('Each filePath item must have a non-empty string contentType.');
        }
      }

      return true; // Return true if all checks pass
    },
  },
});
;
// export const VALIDATION_EMAIL_EXIST = (where: Location): ParamSchema => ({
//   in: [where],
//   isEmail: true,
//   optional: {
//     options: { nullable: true },
//   },
//   isLength: {
//     options: { max: EMAIL_MAX_LENGTH },
//   },
//   custom: {
//     options: async (value, { req, location, path }) => {
//       //  const type = req.body.userType || null;
//       const user = await getUserByEmail(value);
//       if (!user) throw new Error('1002'); // TODO 1002 user email not found
//       if (user.status !== 'active' || user.deletedAt !== null) throw new Error('1016'); // TODO: 1016 user account delete

//       //  if (type !== user.userType) throw new Error('1002');
//       return true;
//     },
//   },
// });

// export const VALIDATION_EMAIL_EXIST_USER_TYPE = (where: Location): ParamSchema => ({
//   in: [where],
//   isEmail: true,
//   optional: {
//     options: { nullable: true },
//   },
//   isLength: {
//     options: { max: EMAIL_MAX_LENGTH },
//   },
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const type = req.body.userType || null;
//       const user = await getUserByEmail(value);
//       if (!user) throw new Error('1002');
//       if (type !== user.userType) throw new Error('1002');
//       if (user.status !== 'active' || user.deletedAt !== null) throw new Error('1016');

//       return true;
//     },
//   },
// });

// export const VALIDATION_EMAIL = (where: Location): ParamSchema => ({
//   in: [where],
//   isEmail: true,
//   isLength: {
//     options: { max: EMAIL_MAX_LENGTH },
//   },
// });

// export const VALIDATION_USER_ID = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       //  const type = req.body.userType || null;
//       const user = await getUserByID(value);
//       if (!user) throw new Error('1002');
//       //  if (type !== user.userType) throw new Error('1002');
//       return true;
//     },
//   },
// });

// export const ADMIN_VALIDATION_EMAIL_EXIST = (where: Location): ParamSchema => ({
//   in: [where],
//   isEmail: true,
//   optional: {
//     options: { nullable: true },
//   },
//   isLength: {
//     options: { max: EMAIL_MAX_LENGTH },
//   },
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const admin = await getAdminByEmail(value);
//       if (!admin) throw new Error('1002');
//       if (admin.deletedAt !== null) throw new Error('1016');

//       return true;
//     },
//   },
// });

// export const VALIDATION_EMAIL_CHECK_UPDATE = (where: Location): ParamSchema => ({
//   in: [where],
//   isEmail: true,
//   optional: {
//     options: { nullable: true },
//   },
//   isLength: {
//     options: { max: EMAIL_MAX_LENGTH },
//   },
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const userCheck = await getUserByEmail(value);
//       if (!userCheck) return true;
//       if (value === userCheck.email) return true;
//       throw new Error('1001'); // TODO 1001 already some used email
//     },
//   },
// });

// export const VALIDATION_EMAIL_NOT_EXIST = (where: Location): ParamSchema => ({
//   in: [where],
//   isEmail: true,
//   optional: {
//     options: { nullable: true },
//   },
//   isLength: {
//     options: { max: EMAIL_MAX_LENGTH },
//   },
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const user = await getUserByEmail(value);
//       if (!user) return true;
//       throw new Error('1001'); // TODO: 1001 EMAIL IS ALREADY EXITS
//     },
//   },
// });

// export const VALIDATION_USER_TYPE = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   isIn: { options: [['companyAdmin', 'clubAdmin', 'clubMember']], errorMessage: "It's not expected value." },
// });

// export const VALIDATION_ADMIN_TYPE = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   isIn: { options: [['superAdmin', 'general']], errorMessage: "It's not expected value." },
// });

// export const VALIDATION_PASSWORD_CHECK = (where: Location, checkBy: 'email' | 'id'): ParamSchema => ({
//   in: [where],
//   isString: true,
//   // matches: {
//   //   options: REGEXP_PASSWORD,
//   // },
//   isLength: {
//     options: { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH },
//   },
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const user = checkBy === 'email' ? await getUserByEmail(req.body.email) : await getUserByID(req.user.userId);
//       if (!user) throw new Error('1002');

//       if (user.userType !== req.body.userType) throw new Error('1006'); // TODO: 1006 user type not match
//       if (user.userType === 'companyAdmin') if (!REGEXP_PASSWORD.test(value)) throw new Error('1005');
//       if (user.userType === 'clubAdmin' || user.userType === 'clubMember')
//         if (!REGEXP_PASSWORD_WEAK.test(value)) throw new Error('1005'); // TODO: 1005 password regEx is wrongs

//       const isMatch = await comparePassword(value, user.password);
//       if (!isMatch) throw new Error('1004'); // TODO: 1004 password is not match
//       req.user = setUser(user);

//       return true;
//     },
//   },
// });

// export const VALIDATION_ADMIN_PASSWORD_CHECK = (where: Location, checkBy: 'email' | 'id'): ParamSchema => ({
//   in: [where],
//   isString: true,
//   matches: {
//     options: REGEXP_PASSWORD,
//   },
//   isLength: {
//     options: { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH },
//   },
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const admin = checkBy === 'email' ? await getAdminByEmail(req.body.email) : await getAdminByID(req.admin.adminId);

//       if (!admin) throw new Error('1002');

//       const isMatch = await comparePassword(value, admin.password);

//       if (!isMatch) throw new Error('1004');
//       req.admin = setAdmin(admin);

//       return true;
//     },
//   },
// });

// export const VALIDATION_ADMIN_PASSWORD = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   matches: {
//     options: REGEXP_PASSWORD,
//   },
//   isLength: {
//     options: { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH },
//   },

//   custom: {
//     options: async (value, { req, location, path }) => {
//       if (!REGEXP_PASSWORD_WEAK.test(value)) throw new Error('1005');
//       return true;
//     },
//   },
// });

// export const VALIDATION_PASSWORD = (where: Location, checkType: 'token' | 'user'): ParamSchema => ({
//   in: [where],
//   isString: true,
//   // matches: {
//   //   options: REGEXP_PASSWORD,
//   // },
//   isLength: {
//     options: { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH },
//   },
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const token = checkType === 'token' ? (req.token as TokenDocument) : (req.user as UserDocument);
//       if (token.userType === 'companyAdmin') if (!REGEXP_PASSWORD.test(value)) throw new Error('1005');
//       if (token.userType === 'clubAdmin' || token.userType === 'clubMember')
//         if (!REGEXP_PASSWORD_WEAK.test(value)) throw new Error('1005');
//       return true;
//     },
//   },
// });

// export const VALIDATION_PROMOTION = (where: Location, checkBy?: 'optional'): ParamSchema => ({
//   in: [where],
//   isNumeric: checkBy !== 'optional' ? true : false,
//   notEmpty: checkBy !== 'optional' ? true : false,
//   isLength: {
//     options: { min: PR_MIN_LENGTH, max: PR_MAX_LENGTH },
//   },
// });

// export const VALIDATION_BOOLEAN = (where: Location, checkBy?: 'optional'): ParamSchema => ({
//   in: [where],
//   isBoolean: checkBy !== 'optional' ? true : false,
//   notEmpty: checkBy !== 'optional' ? true : false,
// });

// export const VALIDATION_STRING = (where: Location, checkBy?: 'optional'): ParamSchema => ({
//   in: [where],
//   isString: checkBy !== 'optional' ? true : false,
//   notEmpty: checkBy !== 'optional' ? true : false,
// });

// export const VALIDATION_PROMOTION_STRING = (where: Location, checkBy?: 'optional'): ParamSchema => ({
//   in: [where],
//   isString: checkBy !== 'optional' ? true : false,
//   notEmpty: checkBy !== 'optional' ? true : false,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       if (value === null || value === undefined || !value) return true;
//       value = value.replace(/\s/g, ''); // remove whitespace in text
//       if (value.length > 150) throw new Error('1045'); // TODO: 1045 STRING NOT CONTAIN MIN 150 CHARACTERS

//       return true;
//     },
//   },
// });

// export const VALIDATION_CATEGORY = (where: Location, category: string[]): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       if (!category.includes(value)) throw new Error('1020'); // TODO: 1020 category not found
//       return true;
//     },
//   },
// });
// export const VALIDATION_PROMOTION_TITLE_STRING = (where: Location, checkBy?: 'optional'): ParamSchema => ({
//   in: [where],
//   isString: checkBy !== 'optional' ? true : false,
//   notEmpty: checkBy !== 'optional' ? true : false,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       value = value.replace(/\s/g, ''); // remove whitespace in text
//       if (value.length > 50) throw new Error('1045'); // TODO: 1045 STRING NOT CONTAIN MIN 150 CHARACTERS

//       return true;
//     },
//   },
// });

// export const VALIDATION_NUMBER = (where: Location, checkBy?: 'optional'): ParamSchema => ({
//   in: [where],
//   isNumeric: checkBy !== 'optional' ? true : false,
//   notEmpty: checkBy !== 'optional' ? true : false,
// });

// export const VALIDATION_ARRAY = (where: Location, checkBy?: 'optional'): ParamSchema => ({
//   in: [where],
//   isArray: checkBy !== 'optional' ? true : false,
//   notEmpty: checkBy !== 'optional' ? true : false,
// });

// export const VALIDATION_DATE = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
//         throw new Error('1021'); // TODO: 1021 date format is wrong 1020
//       }
//       return true;
//     },
//   },
// });
// export const VALIDATION_DISCUSSION_BY_ID = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const discussion = await getDiscussionsById(value);
//       if (!discussion) throw new Error('1040'); // TODO: 1040 discussion id not found
//       return true;
//     },
//   },
// });

// export const VALIDATION_MESSAGE_BY_ID = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const message = await getMessageById(value);
//       if (!message) throw new Error('1022'); // TODO: 1022 messageId not found
//       return true;
//     },
//   },
// });

// export const VALIDATION_TOKEN = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const token = await getTokenByID(value);
//       if (!token) throw new Error('2008'); // TODO: token is not found
//       req.token = token;
//       if (isAfterCurrentJST(token.expiredAt.toISOString())) return true;
//       throw new Error('2009'); // TODO: token is expired
//     },
//   },
// });

// export const VALIDATION_CLUB_ID = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const club = await getClubByID(value);
//       if (!club) throw new Error('1023'); // TODO: 1023 is clubId not found
//       return true;
//     },
//   },
// });

// export const VALIDATION_CLUB_ACTIVITY_ID = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const activity = await getClubActivitiesByID(value);
//       if (!activity) throw new Error('1024'); // TODO: 1024 is club Activity not found
//       return true;
//     },
//   },
// });

// export const VALIDATION_CLUB_MEMBER_ID = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const token = await getClubMemberByID(value);
//       if (!token) throw new Error('1026'); // 1026 is clubMember not found
//       return true;
//     },
//   },
// });

// export const VALIDATION_COMPANY_ID = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const company = await getCompanyByID(value);
//       if (!company) throw new Error('1027'); // 1027 company not found
//       return true;
//     },
//   },
// });

// export const VALIDATION_CLUB_SPONSOR_ID = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const company = await getSponsorsId(value);
//       if (!company) throw new Error('1028'); // 1028 club Sponsor  Id not found
//       return true;
//     },
//   },
// });

// export const VALIDATION_CLUB_SPONSOR_STATUS = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       if (value !== 'offer' && value !== 'active' && value !== 'inactive') throw new Error('1029'); // 1029 club sponsor incorrect status
//       return true;
//     },
//   },
// });

// export const VALIDATION_UNIVERSITY_ID = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const token = await getUniversityByID(value);
//       if (!token) throw new Error('1015'); // University id does not exits
//       return true;
//     },
//   },
// });

// // export const VALIDATION_CLUB_EMAIL = (where: Location): ParamSchema => ({
// //   in: [where],
// //   isString: true,
// //   notEmpty: true,
// //   custom: {
// //     options: async (value, { req, location, path }) => {
// //       const token = await ge(value);
// //       if (!token) throw new Error('1015'); // university id does not exits
// //       return true;
// //     },
// //   },
// // });

// export const VALIDATION_CLUB_BLOG_ID = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const clubBlog = await getClubBlogById(value);
//       if (!clubBlog) throw new Error('1050'); // TODO: 1050 is club blog id not found
//       return true;
//     },
//   },
// });

// export const VALIDATION_CLUB_PROMO_PAGE_ID = (where: Location): ParamSchema => ({
//   in: [where],
//   isString: true,
//   notEmpty: true,
//   custom: {
//     options: async (value, { req, location, path }) => {
//       const clubPromo = await getClubPromotionPageById(value);
//       if (!clubPromo) throw new Error('1051'); // TODO: 1050 is club blog id not found
//       return true;
//     },
//   },
// });
