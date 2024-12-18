import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import { badImplementationException, socketErrorHandle, unauthorizedException } from './apiErrorHandler';
import { Logger } from './log4';
import { Socket } from 'socket.io';

export const encodeJwt = (
  payload: string | Record<string, unknown> | Buffer,
  expiresIn: string | number,
  secret: 'refresh' | 'access' | 'default' = 'default',
) => {
  try {
    const SECRET =
      secret === 'refresh'
        ? process.env.JWT_REFRESH_SECRET
        : secret === 'access'
        ? process.env.JWT_ACCESS_SECRET
        : process.env.JWT_SECRET;
    if (!SECRET) throw badImplementationException('SECRET is not defined on env file');
    const jwToken = jwt.sign({ payload }, SECRET, { expiresIn });
    return jwToken;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};

export const decodeJwt = (jwToken: string, secret: 'refresh' | 'access' | 'default' = 'default') => {
  try {
    const SECRET =
      secret === 'refresh'
        ? process.env.JWT_REFRESH_SECRET
        : secret === 'access'
        ? process.env.JWT_ACCESS_SECRET
        : process.env.JWT_SECRET;
    if (!SECRET) throw badImplementationException('SECRET is not defined on env file');

    const decode = jwt.verify(jwToken, SECRET);
    if (typeof decode === 'string') throw unauthorizedException('JWT token is invalid');

    return decode;
  } catch (err: any) {
    console.error(err);
    throw unauthorizedException('JWT is not valid');
  }
};

export const decodeJwtSocket = (
  jwToken: string,
  secret: 'refresh' | 'access' | 'default' = 'default',
  sesssionId: string,
): JwtPayload => {
  try {
    const SECRET =
      secret === 'refresh'
        ? process.env.JWT_REFRESH_SECRET
        : secret === 'access'
        ? process.env.JWT_ACCESS_SECRET
        : process.env.JWT_SECRET;
    if (!SECRET) throw socketErrorHandle(sesssionId, 'SECRET is not defined on env file', '5000');

    const decode = jwt.verify(jwToken, SECRET);
    if (typeof decode === 'string') throw socketErrorHandle(sesssionId, 'JWT token is invalid', '2001');
    return decode;
  } catch (err: any) {
    throw socketErrorHandle(sesssionId, 'JWT is not valid', '5000');
  }
};
