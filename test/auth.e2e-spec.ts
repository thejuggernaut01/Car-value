import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const randomEmail = 'test9@test.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: randomEmail, password: 'wwefere' })
      .expect(201);

    const { id, email } = res.body;

    expect(id).toBeDefined();
    expect(email).toEqual(randomEmail);
  });
});
