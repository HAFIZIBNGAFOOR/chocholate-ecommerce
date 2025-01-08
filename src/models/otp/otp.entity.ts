import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-paginate-v2';
import { OtpDocument } from '../@types';

// import { OtpDocument } from '../@types/index';

const otpSchema = new mongoose.Schema(
  {
    otpId: { type: String },
    email: { type: String },
    userId: { type: String, default: null },
    otp: { type: Number },

    expiredAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 }); //TODO: auto delete mongodb TTL
otpSchema.plugin(aggregatePaginate);

export const Otp = mongoose.model<OtpDocument, mongoose.PaginateModel<OtpDocument>>('otp', otpSchema, 'otp');
