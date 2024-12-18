import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { connectMongo } from './mongo';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { Request, Response, NextFunction } from 'express';

export const config = async (app: express.Application) => {
  app.use(cors());
  app.use(logger('dev'));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app
    .use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

    .get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../../public/index.html'));
    });
  await connectMongo();
};
