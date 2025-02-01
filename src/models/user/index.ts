import { ClientSession } from 'mongoose';

import { NewUserDocument, UpdateUserDocument } from '../@types';
// import { Plan } from '../plan/plan.entity';
import { Users } from './user.entity';

export const getUserByEmail = async (email: string) => {
  try {
    const admin = await Users.findOne({ email });
    return Promise.resolve(admin);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getUserByID = async (userId: string) => {
  try {
    const user = await Users.findOne({ userId });
    return Promise.resolve(user);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const addUser = async (user: NewUserDocument, session?: ClientSession | null | undefined) => {
  try {
    const newUser = new Users(user);
    await newUser.save({ session });
    return newUser; // Return the created user document
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateUserFields = async (
  userId: string,
  data: UpdateUserDocument,
  session?: ClientSession | null | undefined,
) => {
  try {
    await Users.findOneAndUpdate({ userId }, { $set: data }, { session });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteOneUser = async (userId: string, session?: ClientSession | null | undefined) => {
  try {
    await Users.deleteOne({ userId }, { session });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProfileById = async (userId: string) => {
  try {
    const profile = await Users.findOne({ userId })
      .select('username')
      .select('userId')
      .select('email')
      .select('userType')
      .select('profileImage');
    return Promise.resolve(profile);
  } catch (err) {
    return Promise.reject(err);
  }
};


