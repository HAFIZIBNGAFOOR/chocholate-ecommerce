import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';
import mongoose from 'mongoose';
export const mongoUri = `${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
let token = { accessToken: '', refreshToken: '' };

describe('Company', () => {
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
  // test('company auth register', async () => {
  //   await request(app)
  //     .put(`/api/company/auth/register`)
  //     .send({
  //       name: 'foobar',
  //       password: 'sdfsd',
  //       address: 'sdfgsdf',
  //       tokenId: 'sdgsd',
  //       province: 'sdgdfg',
  //       city: 'sdgsdfg',
  //       industry: 'sdgf',
  //     })
  //     .set('Accept', 'application/json')
  //     .set('Authorization', `Bearer ${token.accessToken}`)

  //     .expect('Content-Type', /json/)
  //     //"data": { "clubs": {  "docs": [],
  //     .then(async (response) => {
  //       expect(response.body.success).toBeDefined();
  //     });
  // });
  let clubId = '';
  test('company get club detail', async () => {
    await request(app)
      .get('/api/company/club/')

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .query({ limit: 10, offset: 0 })

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        const docs = response?.body?.data?.clubs?.docs ?? [];
        clubId = docs?.clubId ?? '';
        if (docs.length < 1) {
          // console.log('message not getting');
        }
        expect(response.body.success).toBeDefined();
      });
    //expect(res.body).toEqual({ success: true });

    // expect(res.statusCode).toBe(200);
  });
  test('company get club by id', async () => {
    await request(app)
      .get(`/api/company/club/${clubId}`)

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });
  test('company get profile', async () => {
    await request(app)
      .get(`/api/company/profile/`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });
  test('company update profile', async () => {
    await request(app)
      .put(`/api/company/profile/`)
      .send({
        companyName: 'dsfgsdgdf',
        logoUrl: 'dfgdfg',
        address: 'dfgfg',
        province: 'dfgdfg',
        city: 'dfgdfgd',
        industry: 'strdfgdfing',
        website: 'dfghdfgfd',
        isPublic: true,
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });
  // test('company quit profile', async () => {
  //   await request(app)
  //     .delete(`/api/company/profile/quit`)

  //     .set('Accept', 'application/json')
  //     .set('Authorization', `Bearer ${token.accessToken}`)

  //     .expect('Content-Type', /json/)
  //     //"data": { "clubs": {  "docs": [],
  //     .then(async (response) => {
  //       expect(response.body.success).toBeDefined();
  //     });
  // });
});
