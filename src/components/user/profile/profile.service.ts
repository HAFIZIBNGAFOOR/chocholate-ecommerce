import { updateUserFields } from '../../../models/user';
import { badImplementationException, HttpException } from '../../../utils/apiErrorHandler';

export const updatePassword = async (userId: string, newPassword: string) => {
  let error: Error | HttpException | undefined;
  try {
    await updateUserFields(userId, { password: newPassword });

    return Promise.resolve();
  } catch (err) {
    console.log(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};
