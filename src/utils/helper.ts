import { AdminDocument, UserDocument } from '../models/@types';

export const setUser = (user: UserDocument) => {
  return {
    userId: user.userId,
    userType: user.userType,
  };
};

export const setAdmin = (admin: AdminDocument) => {
  return {
    adminId: admin.adminId,
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
