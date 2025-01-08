/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { comparePass, hashPassword } from '';
import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import { comparePasswordFunction, UserDocument } from '../@types';
import { hashPassword, compPassword } from '../../utils/bcrypt';

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String },
    userType: {
      type: String,
      enum: ['us', 'ad'],
    },
    email: { type: String, required: true },
    password: { type: String },
    profileImage: { type: String },
    username: { type: String },
    status: {
      type: String,
      enum: ['active', 'deleted', 'suspend'],
      default: 'active',
    },
    otp: { type: Number },
    refreshToken: { type: String },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

UserSchema.pre('save', function save(next) {
  const users = this as any;
  try {
    if (!users.isModified('password') || users.password === null) {
      return next();
    }
    const hash = hashPassword(users.password);
    users.password = hash;
    next();
  } catch (err) {
    next(err as Error);
  }
});

UserSchema.pre('findOneAndUpdate', function findOneAndUpdate(next) {
  try {
    this.where({ deletedAt: null });
    const data: any = this.getUpdate();
    if (data) {
      const password = data.$set.password;
      if (password) {
        this.setOptions({});
        const hash = hashPassword(password);
        this.setUpdate({ ...data.$set, password: hash });
      }
    }
    next();
  } catch (err) {
    return next(err as Error);
  }
});

const comparePassword: comparePasswordFunction = function (this: any, candidatePassword: string, cb: any) {
  try {
    const isMatch = compPassword(candidatePassword, this.password);

    cb(null, isMatch);
  } catch (err) {
    cb(err, false);
  }
};

UserSchema.methods.comparePassword = comparePassword;

// paginate with this plugin

UserSchema.plugin(aggregatePaginate);

export const Users = mongoose.model<UserDocument, mongoose.AggregatePaginateModel<UserDocument>>(
  'users',
  UserSchema,
  'users',
);
