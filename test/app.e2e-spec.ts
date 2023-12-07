import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { print } from 'graphql';
import { createUserMutation, getUsersQuery } from '../src/utils/queries';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.get(DataSource).synchronize(true);
    await app.init();
  });

  afterAll(async () => {
    await app.get(DataSource).dropDatabase();
    await app.get(DataSource).destroy();
    await app.close();
  });

  describe('users', () => {
    it('should query getUsers and return 0 users', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: print(getUsersQuery) })
        .expect((res) => {
          expect(res.body.data.getUsers).toEqual([]);
          expect(res.body.data.getUsers).toHaveLength(0);
        });
    });

    it('shoud create a user using createUser mutation', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: print(createUserMutation) })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createUser).toEqual({
            id: 1,
            username: 'forthtilliath',
            displayName: 'Forth',
          });
        });
    });

    it('should query getUsers and return 1 user', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: print(getUsersQuery) })
        .expect((res) => {
          expect(res.body.data.getUsers).toEqual([
            {
              id: 1,
              username: 'forthtilliath',
              displayName: 'Forth',
            },
          ]);
          expect(res.body.data.getUsers).toHaveLength(1);
        });
    });
  });
});
