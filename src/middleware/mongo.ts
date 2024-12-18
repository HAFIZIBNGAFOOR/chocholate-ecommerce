import mongoose from 'mongoose';

import { Logger } from '../utils/log4';

export const mongoUri = `${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// console.log(mongoUri);

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // user: process.env.DB_USER,
  // pass: process.env.DB_PASS,
  // dbName: process.env.DB_NAME,
  ssl: true,
};

export const connectMongo = async () => {
  mongoose.set('strictQuery', false);
  await mongoose
    .connect(mongoUri, config)
    .then((db: any) => {
      console.log('📗 Connected to Chocolate E-commerce DB');
    })
    .catch((err: any) => {
      console.log(err);
      console.error(err);
    });

  return Promise.resolve();
};
