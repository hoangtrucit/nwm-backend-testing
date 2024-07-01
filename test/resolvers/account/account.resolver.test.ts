import {
  AccountRepository,
  I_ACCOUNT_REPOSITORY,
} from '@/postgresql/repositories/account.repository';
import {
  AccountService,
  I_ACCOUNT_SERVICE,
} from '@/resolvers/account/account.service';
import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { GraphModule } from '@/graphql.module';
import { AccountResolver } from '@/resolvers/account/account.resolver';
import { Body, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AccountRegisterArgs } from '@/resolvers/account/account.args';
import { faker } from '@faker-js/faker';
import { AccountEntity } from '@/postgresql/entities';
import { MOCK_ACCOUNT_ENTITIES } from './fixtures';

describe('Account Service', () => {
  let accountService: AccountService;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GraphModule],
      providers: [
        AccountResolver,
        {
          provide: I_ACCOUNT_SERVICE,
          // setup to mock Account Service
          useValue: createMock<AccountService>(),
        },
        {
          provide: I_ACCOUNT_REPOSITORY,
          // setup to mock Account Repository
          useValue: createMock<AccountRepository>(),
        },
      ],
    }).compile();

    accountService = moduleRef.get(I_ACCOUNT_SERVICE);
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register account success', async () => {
    const payload: AccountRegisterArgs = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
    };

    const accountEntity = new AccountEntity({
      ...payload,
      id: faker.string.uuid(),
    });

    jest.spyOn(accountService, 'register').mockResolvedValue(accountEntity);

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation Mutation($accountRegisterArgs: AccountRegisterArgs!) {
			register(accountRegisterArgs: $accountRegisterArgs) {
				id
				firstName
				lastName
				email
			}
		}`,
        variables: {
          accountRegisterArgs: payload,
        },
      });

    // expect mock implementation
    expect(accountService.register).toHaveBeenCalledWith(payload);
    // expect final result
    expect(res.body.data.register).toMatchObject(accountEntity);
  });

  it('should register account fail with throw error', async () => {
    const msg = 'Account register error';
    const payload: AccountRegisterArgs = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
    };

    jest.spyOn(accountService, 'register').mockImplementation(() => {
      throw new Error(msg);
    });

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation Mutation($accountRegisterArgs: AccountRegisterArgs!) {
			register(accountRegisterArgs: $accountRegisterArgs) {
				id
				firstName
				lastName
				email
			}
		}`,
        variables: {
          accountRegisterArgs: payload,
        },
      });

    expect(res.body.data).toBe(null);
    expect(res.body.errors[0].message).toBeDefined();
    expect(res.body.errors[0].message).toBe(msg);
  });

  it('should get users success', async () => {
    jest
      .spyOn(accountService, 'getAccounts')
      .mockResolvedValue(MOCK_ACCOUNT_ENTITIES);

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `query Query {
		  users {
			  id
			  firstName
			  lastName
			  email
		  }
	  }`,
      });

    expect(accountService.getAccounts).toHaveBeenCalled();
    expect(res.body.data.users).toMatchObject(MOCK_ACCOUNT_ENTITIES);
  });
});
