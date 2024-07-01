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
import { IAccount } from '@/resolvers/account/account.interface';
import { faker } from '@faker-js/faker';
import { AccountEntity } from '@/postgresql/entities';
import { AccountRegisterArgs } from '@/resolvers/account/account.args';
import { MOCK_ACCOUNT_ENTITIES } from './fixtures';

describe('Account Service', () => {
  let accountService: AccountService;
  let accountRepository: AccountRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [
        {
          provide: I_ACCOUNT_REPOSITORY,
          // setup to mock Account Repository
          useValue: createMock<AccountRepository>(),
        },
        {
          provide: I_ACCOUNT_SERVICE,
          useClass: AccountService,
        },
      ],
    }).compile();

    accountService = moduleRef.get(I_ACCOUNT_SERVICE);
    accountRepository = moduleRef.get(I_ACCOUNT_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error duplicate email', async () => {
    const accountArgs: AccountRegisterArgs = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
    };

    const accountEntity = new AccountEntity({
      id: faker.string.uuid(),
      firstName: accountArgs.firstName,
      lastName: accountArgs.lastName,
      email: accountArgs.email,
    });

    jest
      .spyOn(accountRepository, 'findByEmail')
      .mockReturnValue(Promise.resolve(accountEntity));

    try {
      await accountService.register(accountArgs);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Email already exist');
    }
  });

  it('should register account success', async () => {
    const accountArgs: AccountRegisterArgs = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
    };

    const accountEntity = new AccountEntity({
      id: faker.string.uuid(),
      firstName: accountArgs.firstName,
      lastName: accountArgs.lastName,
      email: accountArgs.email,
    });

    jest
      .spyOn(accountRepository, 'findByEmail')
      .mockReturnValue(Promise.resolve(null));

    jest
      .spyOn(accountRepository, 'saveAccount')
      .mockReturnValue(Promise.resolve(accountEntity));

    const newAccount = await accountService.register(accountArgs);

    expect(newAccount).toBeInstanceOf(AccountEntity);
    expect(newAccount).toMatchObject(accountEntity);
  });

  it('shoudl get users success', async () => {
    jest
      .spyOn(accountRepository, 'findAll')
      .mockResolvedValue(MOCK_ACCOUNT_ENTITIES);

    const accounts = await accountService.getAccounts();

    expect(accounts).toMatchObject(MOCK_ACCOUNT_ENTITIES);
  });
});
