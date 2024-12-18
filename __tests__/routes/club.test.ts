import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

import app from '../../src/app';
import mongoose from 'mongoose';
import { ClubMembers } from '../../src/models/clubMember/clubMember.entity';
import { Users } from '../../src/models/user/user.entity';
export const mongoUri = `${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
var randomEmail = require('random-email');

let token = { accessToken: '', refreshToken: '' };

describe('Club Admin', () => {
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
        email: 'mrpandavibes@gmail.com',
        password: 'Hemak@72',
        userType: 'clubAdmin',
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
  let clubId = '';
  test('club get profile', async () => {
    await request(app)
      .get(`/api/club/profile`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        const docs = response?.body?.data?.club?.clubId ?? [];
        clubId = docs;
        console.log(clubId);
        expect(response.body.success).toBeDefined();
      });
  });

  test('club update profile', async () => {
    await request(app)
      .put(`/api/club/profile`)
      .send({
        clubName: 'sdfsdfs',
        imageUrl: 'sdfsdf',
        website: 'sdfsdf',
        twitter: 'sdfsdfsdf',
        instagram: 'sdfsdfs',
        category: 'sdfsdfgsdg',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });
  test('club update Promo', async () => {
    await request(app)
      .put(`/api/club/profile/promo`)
      .send({
        title: 'string',
        description: 'string',
        imageUrls: 'string',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });

  let clubMemberId = '';
  test('club admin get club member', async () => {
    await request(app)
      .get(`/api/club/member`)
      .query({ limit: 10, offset: 0 })

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        const docs = response?.body?.data?.members?.docs[0];
        clubMemberId = docs?.clubMemberId ?? '';

        expect(response.body.success).toBeDefined();
      });
  });

  test('admin create club member', async () => {
    await request(app)
      .post(`/api/club/member`)
      .send({
        email: randomEmail(),
        clubId,
        clubMemberName: 'xcgdf',
        imageUrl: 'dfgd',
        hometown: 'dfg',
        grade: 'dfg',
        major: 'dfg',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });

  test('club admin update club member', async () => {
    await request(app)
      .put(`/api/club/member/${clubMemberId}`)
      .send({
        clubId: clubId,
        clubMemberName: 'sedfsedf',
        imageUrl: 'serfsedf',
        hometown: 'sdfgsdfg',
        grade: 'sdgfsdfgsd',
        major: 'sdfgsdgfdgdf',
        personalTestResultUrl: 'sdfs',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });
  test('club quite membership', async () => {
    await request(app)
      .post(`/api/club/profile/quit`)
      .send({
        title: 'string',
        description: 'string',
        imageUrls: 'string',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
        await ClubMembers.updateMany({}, { $set: { deletedAt: null } }, { new: true });
        await Users.updateMany({}, { $set: { deletedAt: null } }, { new: true });
      });
  });

  // test('club admin delete club member', async () => {
  //   await request(app)
  //     .delete(`/api/club/member/${clubMemberId}`)

  //     .set('Accept', 'application/json')
  //     .set('Authorization', `Bearer ${token.accessToken}`)

  //     .expect('Content-Type', /json/)
  //     //"data": { "clubs": {  "docs": [],
  //     .then(async (response) => {
  //       expect(response.body.success).toBeDefined();
  //     });
  // });
});
