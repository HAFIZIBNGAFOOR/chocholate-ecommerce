import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';
import mongoose from 'mongoose';
export const mongoUri = `${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
let token = { accessToken: '', refreshToken: '' };

describe('Club Memeber', () => {
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
  setTimeout(() => {
    console.log('mongodb connection wait response 3 sec');
  }, 3000);
  test('login username and password', async () => {
    await request(app)
      .put('/api/user/auth/login')
      .send({
        userType: 'clubMember',
        email: 'kohobos819@elixirsd.com',
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
  test('club member get profile', async () => {
    await request(app)
      .get(`/api/clubMember/member/profile`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });

  test('club member update profile', async () => {
    await request(app)
      .put(`/api/clubMember/member/profile`)
      .send({
        title: 'sdfsdfsdfg',
        description: 'ssdfsdf',
        imageUrls: 'sadfsdfsdf',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });
});
