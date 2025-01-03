import mongoose, { SortOrder, UpdateQuery } from 'mongoose';

export type UpdateType<T> = {
  fieldName: keyof T;
  value: string;
  updateData: UpdateQuery<T>;
};

export type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: boolean) => void) => void;

export type NewUserDocument = {
  userId: string;
  userType: 'us' | 'ad';
  email: string;
  status: 'active' | 'deleted' | 'suspend';
  profileImage?: string;
  username?: string;
  otp?: number;
  refreshToken: string | null;
  deletedAt: Date | null;
};

export type UpdateUserDocument = Partial<NewUserDocument>;

export type UserDocument = mongoose.Document &
  NewUserDocument & {
    comparePassword: comparePasswordFunction;
  };

export type NewTokenDocument = {
  tokenId: string;
  userId: string | null;
  email: string;
  tokenType: 'forgot' | 'register';
  expiredAt: Date | null;
};
export type TokenDocument = mongoose.Document & NewTokenDocument & TokenAdminDocument;

export type NewAdminDocument = {
  adminId: string;
  email: string;
  password: string;
  adminType: 'superAdmin' | 'admin';
  refreshToken?: string | null;
  deletedAt: Date | null;
};

export type UpdateAdminDocument = {
  email?: string;
  password?: string;
  name?: string;
  adminType?: 'superAdmin' | 'admin';
  refreshToken?: string | null;
};

export type AdminDocument = mongoose.Document &
  NewAdminDocument & {
    comparePassword: comparePasswordFunction;
  };
export type NewTokenAdminDocument = {
  tokenId: string;
  adminId: string | null;
  tokenType: 'forgot' | 'register';
  email: string;
  expiredAt: Date | null;
};
export type TokenAdminDocument = mongoose.Document & NewTokenAdminDocument;

export type NewProductDocument = {
  productId: string;
  name: string;
  description?: string;
  category: string; // e.g., 'Dark Chocolate', 'Milk Chocolate'
  price: number;
  discountedPrice: number;
  discount?: number; // percentage discount
  stock: number;
  weight?: string; // e.g., '100g', '250g'
  ingredients?: string[]; // Array of ingredients
  nutritionInfo?: {
    calories?: number;
    sugar?: number; // in grams
    fat?: number; // in grams
    protein?: number; // in grams
  };
  images: string[]; // Array of image URLs
  tags?: string[]; // e.g., 'vegan', 'sugar-free'
  brand?: string;
  isFeatured?: boolean;
  status?: 'available' | 'out-of-stock' | 'discontinued';
  ratings?: {
    average?: number;
    count?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type UpdateProductDocument = Partial<NewProductDocument>;

export type ProductDocument = mongoose.Document & NewProductDocument;

export type NewOtpDocument = {
  otpId: string;
  userId: string | null;
  email: string;
  otp: number;
  expiredAt: Date;
};

export type OtpDocument = mongoose.Document & NewOtpDocument;

export type FilePathDocument = {
  fileName: string;
  contentType: string;
};