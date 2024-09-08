import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { rm } from 'fs/promises';
import { join } from 'path';

describe('Authentication system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    try {
      await rm(join(__dirname, '..', 'test.sqlite'));
    } catch (error) {
      console.log(error);
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const randomEmail = 'test10@test.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: randomEmail, password: 'wwefere' });

    const { id, email } = res.body;

    expect(res.status).toBe(201);
    expect(id).toBeDefined();
    expect(email).toEqual(randomEmail);
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'asdf@asdf.com';

    // This req respond with a cookie which is a proof that we're signed in
    // when we make a follow up request.

    // Unfortunately, superagent (library we're using to make request)
    // doesn't handle cookies for us. so we need to temporarily store the cookie and send it in the follow-up req
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdf' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/currentUser')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
