import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { print } from 'graphql';
import { createUserMutation, getUsersQuery } from '../src/utils/queries';
import { UsersService } from '../src/users/users.service';
import { UsersController } from '../src/users/users.controller';
import { Users } from '../src/graphql/models/User';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
  });

  afterAll(async () => {
    await app.get(DataSource).dropDatabase();
    await app.get(DataSource).destroy();
    await app.close();
  });

  describe('users graphql', () => {
    beforeAll(async () => {
      await app.get(DataSource).synchronize(true);
      await app.init();
    });

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

  describe('user api with spyon', () => {
    let usersController: UsersController;
    let usersService: UsersService;

    beforeAll(async () => {
      await app.get(DataSource).synchronize(true);
      await app.init();
    });

    beforeEach(() => {
      usersService = new UsersService(app.get(DataSource).getRepository(Users));
      usersController = new UsersController(usersService);
    });

    it('should query getUsers and return 0 users', async () => {
      const result: Promise<Users[]> = new Promise((r) => r([]));
      jest.spyOn(usersService, 'getUsers').mockImplementation(() => result);

      expect(usersController.getUsers()).toEqual(result);
    });
  });

  describe('users api with request', () => {
    beforeAll(async () => {
      await app.get(DataSource).synchronize(true);
      await app.init();
    });

    it('should query getUsers and return 0 users using GET /api/users', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(200)
        .expect([]);
    });

    it('shoud create a user using POST /api/users', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .set('Accept', 'application/json')
        .send({
          username: 'forthtilliath',
          displayName: 'Forth',
        })
        .expect(201)
        .expect({
          id: 1,
          username: 'forthtilliath',
          displayName: 'Forth',
        });
    });

    it('should query getUsers and return 1 user using GET /api/users', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(200)
        .expect([
          {
            id: 1,
            username: 'forthtilliath',
            displayName: 'Forth',
            settings: null,
          },
        ]);
    });

    it('shoud create a user without displayName using POST /api/users', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .set('Accept', 'application/json')
        .send({
          username: 'yakio',
        })
        .expect(201)
        .expect({
          id: 2,
          username: 'yakio',
          displayName: null,
        });
    });

    it('should query getUsers and return 2 users using GET /api/users', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(200)
        .expect([
          {
            id: 1,
            username: 'forthtilliath',
            displayName: 'Forth',
            settings: null,
          },
          {
            id: 2,
            username: 'yakio',
            displayName: 'yakio', // interceptor
            settings: null,
          },
        ]);
    });

    it('should query getUsers and return 2 users using GET /api/users', () => {
      return request(app.getHttpServer())
        .get('/api/users/2')
        .expect(200)
        .expect({
          id: 2,
          username: 'yakio',
          displayName: null, // no interceptor here
          settings: null,
        });
    });
  });
});
