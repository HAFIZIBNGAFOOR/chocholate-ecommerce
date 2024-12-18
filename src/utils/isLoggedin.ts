import { Request, Response, NextFunction } from 'express';
import { unauthorizedException } from './apiErrorHandler';
import { decodeJwt } from './jwt';
import { getUserByID } from '../models/user';
import { setUser } from './helper';

export const isLoggedin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers['authorization'];
    if (!bearer) return next();

    const token = bearer.split(' ')[1];
    const decoded = decodeJwt(token, 'access');

    const user = await getUserByID(decoded.payload.id);
    if (!user) return next();
    if (user.deletedAt) throw unauthorizedException('This user is not deleted');

    req.user = setUser(user);
    next();
  } catch (err) {
    console.warn(err);
    next(err);
  }
};
