import express, { Request, Response, NextFunction } from 'express';
import createHttpError, { HttpError } from 'http-errors';

export const errorHandler = (app: express.Application): void => {
  app.use((req: Request, res: Response, next: NextFunction) => next(createHttpError(404)));

  app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    return res.status(err.statusCode || 500).json(err);
  });
};
