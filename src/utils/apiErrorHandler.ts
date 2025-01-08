import * as ERROR from '../constants/errorMessage';
import { ValidationError } from 'express-validator';
// import { io } from '../middleware/socket';

export class HttpException extends Error {
  statusCode?: number;
  message: string;
  errorMessage: string | string[];
  subStatusCode?: string;

  constructor(statusCode: number, messages: string | string[], subStatusCode: string) {
    super(messages[0]);
    this.statusCode = statusCode || 500;
    this.message = Array.isArray(messages) ? messages[0] : messages;
    this.errorMessage = messages;
    this.subStatusCode = subStatusCode;
  }
}

export const validationException = (errors: ValidationError[]) => {
  //   errors && console.warn(errors);
  errors;
  return new HttpException(
    400,
    errors[0].type === 'field' ? `Validation Error: ${errors[0].path}` : 'Validation Error: ' + errors[0].msg,
    errors[0].type === 'field' ? (errors[0].msg === 'Invalid value' ? '2006' : errors[0].msg) : '0000',
  );
};

export const invalidException = (error: any, subStatusCode: string) => {
  error ? console.warn(error) : console.warn(ERROR.DATANOTFOUND);
  return new HttpException(400, error || ERROR.DATANOTFOUND, subStatusCode);
};

export const dataNotExistException = (error: any) => {
  error ? console.warn(error) : console.warn(ERROR.DATANOTFOUND);
  return new HttpException(400, error || ERROR.DATANOTFOUND, '1002');
};

export const userNotActivateException = (error: any) => {
  error ? console.warn(error) : console.warn(ERROR.USERNOTACTIVATE);
  return new HttpException(400, error || ERROR.USERNOTACTIVATE, '1003');
};

export const dataExceedException = (error: any) => {
  error ? console.warn(error) : console.warn(ERROR.DATAEXCEED);
  return new HttpException(400, error || ERROR.DATAEXCEED, '1004');
};

export const unauthorizedException = (error: any) => {
  error ? console.warn(error) : console.warn(ERROR.UNAUTH);
  return new HttpException(401, error || ERROR.UNAUTH, '2001');
};
export const dataConflictException = (error: any, subStatusCode?: string) => {
  error ? console.warn(error) : console.warn(ERROR.CONFLICT);
  return new HttpException(409, error || ERROR.CONFLICT, subStatusCode ? subStatusCode : '3001');
};

export const pageNoFoundException = (error: any) => {
  error ? console.warn(error) : console.warn(ERROR.PAGENOTFOUND);
  return new HttpException(404, error || ERROR.PAGENOTFOUND, '4000');
};

export const badImplementationException = (error: any) => {
  error ? console.error(error) : console.error(ERROR.BADIMPLEMENTATION);
  return new HttpException(500, error || ERROR.BADIMPLEMENTATION, '5000');
};

// export const socketErrorHandle = (sessionId: string, message: string, subStatusCode: string) => {
//   return io.of('/api/user/socket').to(sessionId).emit('Error', {
//     message,
//     subStatusCode,
//   }); //  object types message
// };
