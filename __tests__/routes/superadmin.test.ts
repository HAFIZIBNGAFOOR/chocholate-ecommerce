import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';

import request from 'supertest';

import app from '../../src/app';
import mongoose from 'mongoose';
import { Tokens } from '../../src/models/token/token.entity';
export const mongoUri = `${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
var randomEmail = require('random-email');

let token = { accessToken: '', refreshToken: '' };
describe('Super Admin', () => {
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
      .put('/api/admin/auth/login')
      .send({
        email: 'hemakumarm72@gmail.com',
        password: 'Hemak@72',
        adminType: 'superAdmin',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(async (response) => {
        token.refreshToken = response?.body?.refreshToken;
        token.accessToken = response?.body?.accessToken;

        expect(response.body.success).toBeDefined();
      });

    //expect(res.body).toEqual({ success: true });
  });
  let adminId = '';
  test('admin get member adminlist', async () => {
    await request(app)
      .get(`/api/admin/members/`)
      .query({ limit: 10, offset: 0 })

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        const docs = response?.body?.data?.members.docs[0];
        adminId = docs?.adminId ?? '';
        expect(response.body.success).toBeDefined();
      });
  });

  test('admin create  member', async () => {
    await request(app)
      .post(`/api/admin/members/`)
      .send({
        email: randomEmail(),
        password: 'Hemak@72',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });

  test('admin update  member', async () => {
    await request(app)
      .put(`/api/admin/members/${adminId}`)
      .send({
        email: 'hemakumarm72@gmail.com',
        password: 'Hemak@72',
        adminType: 'superAdmin',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });
  // test('admin delete member', async () => {
  //   await request(app)
  //     .delete(`/api/admin/members/${adminId}`)

  //     .set('Accept', 'application/json')
  //     .set('Authorization', `Bearer ${token.accessToken}`)

  //     .expect('Content-Type', /json/)
  //     //"data": { "clubs": {  "docs": [],
  //     .then(async (response) => {
  //       expect(response.body.success).toBeDefined();
  //     });
  // });
});
