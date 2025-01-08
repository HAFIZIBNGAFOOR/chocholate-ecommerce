// import * as service from './profile.service';
// import { Request, Response, NextFunction } from 'express';

// import { unauthorizedException } from '../../../utils/apiErrorHandler';
// import { handleResponse } from '../../../middleware/requestHandle';

// export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
//   try {

//     //   Get userId in userAuth.
//     const { userId } = req.user;

//     //  Check whether userId exists.
//     if (!userId) throw unauthorizedException('User ID is not defined.');

//     //  Get newPassword in body
//     const { newPassword } = req.body;
    
//     // Updates password from  Users collection .
//     await service.updatePassword(userId, newPassword);
//     return handleResponse(res,200,{})
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// };
