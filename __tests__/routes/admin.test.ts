import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';

import request from 'supertest';

import app from '../../src/app';
import mongoose from 'mongoose';
import { Tokens } from '../../src/models/token/token.entity';
export const mongoUri = `${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
var randomEmail = require('random-email');

let token = { accessToken: '', refreshToken: '' };
let tokenid = '';
describe('Admin', () => {
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

  test('login without password', async () => {
    const res = await request(app)
      .put('/api/admin/auth/login')
      .send({
        email: 'hemakumarm72@gmail.com',
        adminType: 'superAdmin',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    //expect(res.body).toEqual({ success: true });
    expect(res.statusCode).toBe(400);
  });

  // test('forgot password', async () => {
  //   const data = { logemailinId: 'hemakumarm72@gmail.com', adminType: 'superAdmin' };
  //   await request(app)
  //     .post('/api/admin/auth/password/forgot')
  //     .send(data)
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .then(async (response) => {
  //       const findtoken = await Tokens.findOne({ email: data.email });
  //       // console.log(findtoken);
  //       if (!findtoken) {
  //         throw new Error('1002');
  //         // expect(Promise.resolve(response)).rejects.toThrow('Expected error message email not found');
  //       }
  //       if (findtoken?.tokenType !== 'passwordReset') {
  //         //	new Error('not valid token');
  //         throw new Error('1002');
  //       }
  //       tokenid = findtoken?.tokenId ?? '';

  //       expect(response.body.success).toBeDefined();
  //     });
  //   //expect(res.body).toEqual({ success: true });
  // });

  // test('reset password', async () => {
  //   await request(app)
  //     .put('/api/admin/auth/password/reset')
  //     .send({
  //       password: 'Hemak@72',
  //       tokenId: tokenid,
  //     })
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)

  //     //expect(res.body).toEqual({ success: true });
  //     .then((response) => {
  //       expect(response.body.success).toBeDefined();
  //     });
  // });

  test('refresh token', async () => {
    await request(app)
      .post('/api/admin/auth/refresh')
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
  let clubId = '';
  test('admin get club detail', async () => {
    await request(app)
      .get('/api/admin/club/')

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .query({ limit: 10, offset: 0 })

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        const docs = response?.body?.data?.clubs?.docs[0] ?? [];
        clubId = docs?.clubId ?? '';
        if (docs.length < 1) {
          // console.log('message not getting');
        }
        expect(response.body.success).toBeDefined();
      });
    //expect(res.body).toEqual({ success: true });

    // expect(res.statusCode).toBe(200);
  });

  let universityId = '';

  // 38917a22-02bd-434d-8bc2-80894a718d53
  // universityId
  test('admin get unversity create', async () => {
    await request(app)
      .post('/api/admin/universities/')
      .send({
        universityName: 'Hemaunveristy',
        logoUrl: 'sdgsdfgsdfgdf',
        address: 'sdfgdfgdfg',
        province: 'sdfgdfgdfg',
        city: 'sdfgsdfgdfg',
        website: 'sdfgdsfgdf',
        universityType: 'national',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });
  test('admin get unversity detail', async () => {
    await request(app)
      .get('/api/admin/universities/')

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .query({ limit: 10, offset: 0 })

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        const docs = response?.body?.data?.universities?.docs ?? [];
        if (docs.length < 1) {
          // console.log('message not getting');
        }
        universityId = docs[0]?.universityId ?? '';
        expect(response.body.success).toBeDefined();
      });
  });

  test('admin get unversity update', async () => {
    await request(app)
      .put(`/api/admin/universities/${universityId}`)
      .send({
        universityName: 'Hemaunveristy',
        logoUrl: 'sdgsdfgsdfgdf',
        address: 'sdfgdfgdfg',
        province: 'sdfgdfgdfg',
        city: 'sdfgsdfgdfg',
        website: 'sdfgdsfgdf',
        universityType: 'national',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });

  test('admin get unversity delete', async () => {
    await request(app)
      .delete(`/api/admin/universities/${universityId}`)

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });
  test('admin create club', async () => {
    await request(app)
      .post(`/api/admin/club/`)

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .send({
        email: randomEmail(),
        universityId: 'string',
        clubName: 'string',
        imageUrl: 'string',
        twitter: 'string',
        website: 'string',
        instagram: 'string',
        category: 'string',
      })
      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });

  test('admin get club by id', async () => {
    await request(app)
      .get(`/api/admin/club/${clubId}/profile`)

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });

  test('admin get club update', async () => {
    await request(app)
      .put(`/api/admin/club/${clubId}/profile`)
      .send({
        clubName: 'zdfgsdg',
        imageUrl: 'sdfg',
        website: 'dfgdfg',
        twitter: 'dsfgd',
        instagram: 'ssdfgdftring',
        category: 'dfgdfg',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });
  //TODO duplicate test case
  // test('admin get company', async () => {
  //   await request(app)
  //     .get('/api/admin/company')

  //     .set('Accept', 'application/json')
  //     .set('Authorization', `Bearer ${token.accessToken}`)

  //     .expect('Content-Type', /json/)
  //     //"data": { "clubs": {  "docs": [],
  //     .then(async (response) => {
  //       expect(response.body.success).toBeDefined();
  //     });
  // });
  let companyId = '';
  test('admin get comapanies', async () => {
    await request(app)
      .get('/api/admin/companies/')
      .query({ limit: 10, offset: 0 })

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        const docs = response?.body?.data?.companies?.docs ?? [];

        companyId = docs[0]?.companyId ?? '';

        expect(response.body.success).toBeDefined();
      });
  });
  test('admin get companies update', async () => {
    await request(app)
      .put(`/api/admin/companies/${companyId}/profile`)
      .send({
        companyName: 'string',
        logoUrl: 'string',
        address: 'string',
        province: 'string',
        city: 'string',
        industry: 'string',
        website: 'string',
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
  let clubMemberId = '';
  test('admin get club member', async () => {
    await request(app)
      .get(`/api/admin/club/${clubId}/members`)

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        const docs = response?.body?.data?.members[0];
        clubMemberId = docs?.clubMemberId ?? '';
        expect(response.body.success).toBeDefined();
      });
  });

  test('admin create club member', async () => {
    await request(app)
      .post(`/api/admin/club/${clubId}/members`)
      .send({
        email: randomEmail(),
        clubMemberName: 'xcgdf',
        imageUrl: 'dfgd',
        hometown: 'dfg',
        grade: 'dfg',
        major: 'dfg',
        personalTestResultUrl: 'dfgdfg',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });

  test('admin update club member', async () => {
    await request(app)
      .put(`/api/admin/club/${clubId}/members/${clubMemberId}`)
      .send({
        email: randomEmail(),
        clubMemberName: 'string',
        imageUrl: 'string',
        hometown: 'string',
        grade: 'string',
        major: 'string',
        personalTestResultUrl: 'dfsf',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });
  test('admin delete club member', async () => {
    await request(app)
      .delete(`/api/admin/club/${clubId}/members/${clubMemberId}`)

      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.accessToken}`)

      .expect('Content-Type', /json/)
      //"data": { "clubs": {  "docs": [],
      .then(async (response) => {
        expect(response.body.success).toBeDefined();
      });
  });
});
