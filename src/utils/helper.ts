import { AdminDocument, UserDocument } from '../models/@types';

export const setUser = (user: UserDocument) => {
  return {
    userId: user.userId,
    userType: user.userType,
    companyId: user.companyId,
    clubId: user.clubId,
    clubMemberId: user.clubMemberId,
  };
};

export const setAdmin = (admin: AdminDocument) => {
  return {
    adminId: admin.adminId,
    adminType: admin.privilege,
    email: admin.email,
  };
};

export const undefinedRemover = (field: object) => {
  const filteredFilters: any = {};
  Object.entries(field).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && !Number.isNaN(value)) {
      filteredFilters[key] = value;
    }
  });
  return filteredFilters;
};
