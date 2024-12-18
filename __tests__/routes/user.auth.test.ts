import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';

import request from 'supertest';

import app from '../../src/app';
import mongoose from 'mongoose';
import { Tokens } from '../../src/models/token/token.entity';
export const mongoUri = `${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

let token = { accessToken: '', refreshToken: '' };

describe('User Auth ', () => {
  beforeAll(async () => {
    const config = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // user: process.env.DB_USER,
      // pass: process.env.DB_PASS,
      // dbName: process.env.DB_NAME,
      ssl: true,
    };
    console.log('mongodb connection check...');
    await mongoose.connect(mongoUri, config);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('login username and password', async () => {
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

  test('login without password', async () => {
    const res = await request(app)
      .put('/api/user/auth/login')
      .send({
        userType: 'companyAdmin',
        email: 'hemakumarm72@gmail.com',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    //expect(res.body).toEqual({ success: true });
    expect(res.statusCode).toBe(400);
  });

  let tokenid = '';
  test('forgot password', async () => {
    const data = { email: 'hemakumarm72@gmail.com', userType: 'companyAdmin' };
    await request(app)
      .post('/api/user/auth/password/forgot')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(async (response) => {
        const findtoken = await Tokens.findOne({ email: data.email });
        if (!findtoken) {
          expect(Promise.resolve(response)).rejects.toThrow('Expected error message email not found');
        }
        if (findtoken?.tokenType !== 'passwordReset') {
          new Error('not valid token');
        }
        tokenid = findtoken?.tokenId ?? '';

        expect(response.body.success).toBeDefined();
      });
    //expect(res.body).toEqual({ success: true });
  });

  test('reset password', async () => {
    await request(app)
      .put('/api/user/auth/password/reset')
      .send({
        password: 'Hemak@72',
        tokenId: tokenid,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

      //expect(res.body).toEqual({ success: true });
      .then((response) => {
        expect(response.body.success).toBeDefined();
      });
  });

  test('refresh token', async () => {
    await request(app)
      .post('/api/user/auth/refresh')
      .send({
        refreshToken: token.refreshToken ?? '',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(async (response) => {
        token.refreshToken = response.body.refreshToken;
        token.accessToken = response.body.accessToken;

        expect(response.body.success).toBeDefined();
      });
    //expect(res.body).toEqual({ success: true });
  });

  test('get message', async () => {
    await request(app)
      .get('/api/user/messages/')

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .query({ offset: 0 })

      .expect('Content-Type', /json/)

      .then(async (response) => {
        const docs = response?.body?.data?.discussions?.docs ?? [];
        if (docs.length < 1) {
          new Error('message not getting');
        }
        expect(response.body.success).toBeDefined();
      });
    //expect(res.body).toEqual({ success: true });

    // expect(res.statusCode).toBe(200);
  });

  let discussionId = '';

  test('create message', async () => {
    await request(app)
      .post('/api/user/messages/')
      .send({
        userType: 'companyAdmin',
        receiver: 'aa23fa67-6f8c-4392-b021-2ddf5fefb810',
        message: 'Jest test',
      })
      .set('Authorization', `Bearer ${token.accessToken}`)

      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(async (response) => {
        discussionId = response?.body?.data?.discussionId ?? '';
        expect(response.body.success).toBeDefined();
      });
    //expect(res.body).toEqual({ success: true });
    //expect(res.statusCode).toBe(400);
  });

  test('get message by discussion id', async () => {
    await request(app)
      .get(`/api/user/messages/${discussionId}`)

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .query({ offset: 0 })

      .expect('Content-Type', /json/)
      .expect(200)
      .then(async (response) => {
        const docs = response?.body?.data?.discussions?.docs ?? [];
        if (docs.length < 1) {
          new Error('message less than is 1');
        }
        expect(response.body.success).toBeDefined();
      });
    //expect(res.body).toEqual({ success: true });

    // expect(res.statusCode).toBe(200);
  });
});
