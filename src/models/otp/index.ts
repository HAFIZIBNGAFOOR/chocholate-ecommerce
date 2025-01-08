import { ClientSession } from 'mongoose';

import { NewOtpDocument } from '../@types';
import { Otp } from './otp.entity';

export const addOtp = async (otp: NewOtpDocument, session?: ClientSession | null | undefined) => {
  try {
    const newOtp = new Otp(otp);
    await newOtp.save({ session });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getOtp = async (input: number, type: 'id' | 'otp') => {
  try {
    let data = {};
    type === 'id' ? (data = { otpId: input }) : (data = { otp: input });
    const result = await Otp.findOne(data);

    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getEmailOtp = async (email: string, query?: object) => {
  try {
    const result = await Otp.findOne({ email, ...query });

    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteOtp = async (
  input: string,
  type: 'id' | 'email' | 'otp',
  session?: ClientSession | null | undefined,
) => {
  try {
    let data = {};
    type === 'id' ? (data = { otpId: input }) : (data = { email: input });
    await Otp.deleteOne(data, { session });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
