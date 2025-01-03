/* eslint-disable @typescript-eslint/no-unsafe-call */
import AWS from 'aws-sdk';

// import { AWSBucketName, BucketFolder, linodeConfig } from '../config/env';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const BucketFolder = process.env.BUCKET_FOLDER;

export const uploadSignedUrl = async (userId: string, filePath: string, contentType: string) => {
  try {
    const Key: string = `${BucketFolder}/${userId}/${filePath}`;

    const PARAMS = {
      Bucket: BUCKET_NAME,
      Key,
      Expires: 60 * 10, // expires in 10 minutes
      ContentType: contentType,
    };
    const URL: string = await s3.getSignedUrlPromise('putObject', PARAMS);
    return URL;
  } catch (error) {
    return Promise.reject(error);
  }
};
