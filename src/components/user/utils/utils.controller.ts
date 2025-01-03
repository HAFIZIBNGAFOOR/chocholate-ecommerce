import { Request, Response, NextFunction } from 'express';
import { badImplementationException } from '../../../utils/apiErrorHandler';
import { handleResponse } from '../../../middleware/requestHandle';
import { uploadSignedUrl } from '../../../utils/s3service';
import { FilePathDocument } from '../../../models/@types';

const BucketFolder = process.env.BUCKET_FOLDER;

export const getSignedUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filePath = req.body.filePath as FilePathDocument[];
    const { userId } = req.user;

    if (!userId) throw badImplementationException('authorization process has something wrong.');
    const getSignedUrls = await Promise.all(
      filePath.map(
          async (item: FilePathDocument): Promise<object> => ({
              fileName: item.fileName,
              contentType: item.contentType,
              filePath: `${BucketFolder}/${userId}/${item.fileName}`,
              signedUrl: await uploadSignedUrl(userId, item.fileName, item.contentType),
        }),
      ),
    );
    return handleResponse(res, 200, { urls: getSignedUrls });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
