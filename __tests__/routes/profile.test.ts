import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';
import mongoose from 'mongoose';
export const mongoUri = `${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

describe('Profile ', () => {
  beforeAll(async () => {
    const config = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // user: process.env.DB_USER,
      // pass: process.env.DB_PASS,
      // dbName: process.env.DB_NAME,
      ssl: true,
    };
    await mongoose.connect(mongoUri, config);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  let token = { accessToken: '', refreshToken: '' };

  test('get access Token', async () => {
    await request(app)
      .put('/api/user/auth/login')
      .send({
        userType: 'companyAdmin',
        email: 'hemakumarm72@gmail.com',
        password: 'Hemak@72',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(async (response) => {
        token.refreshToken = response.body.refreshToken;
        token.accessToken = response.body.accessToken;
        expect(response.body.success).toBeDefined();
      });

    //expect(res.body).toEqual({ success: true });
  });

  test('Password update', async () => {
    await request(app)
      .put('/api/user/profile/password')
      .send({
        currentPassword: 'Hemak@72',
        newPassword: 'Hemak@72',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      .expect(200)
      .then(async (response) => {
        // console.log(response.body);
        expect(response.body.success).toBeDefined();
      });

    //expect(res.body).toEqual({ success: true });
  });
});
