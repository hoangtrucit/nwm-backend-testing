import { AccountRegisterArgs } from '@/resolvers/account/account.args';
import { IAccount } from '@/resolvers/account/account.interface';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('Account DTO', () => {
  it('should validate fail without first name', async () => {
    // define a plain object
    const account: Omit<IAccount, 'id' | 'firstName'> = {
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
    };

    // transform to Instance
    const instance = plainToInstance(AccountRegisterArgs, account);

    // validate
    const validationResults = await validate(instance);

    expect(validationResults.length).toBeGreaterThan(0);
    expect(validationResults[0].constraints?.isNotEmpty).toBeDefined();
    expect(validationResults[0].constraints?.isNotEmpty).toBe(
      'firstName should not be empty',
    );
  });

  it('should validate fail without last name', async () => {
    // define a plain object
    const account: Omit<IAccount, 'id' | 'lastName'> = {
      firstName: faker.person.firstName(),
      email: faker.internet.email(),
    };

    // transform to Instance
    const instance = plainToInstance(AccountRegisterArgs, account);

    // validate
    const validationResults = await validate(instance);

    expect(validationResults.length).toBeGreaterThan(0);
    expect(validationResults[0].constraints?.isNotEmpty).toBeDefined();
    expect(validationResults[0].constraints?.isNotEmpty).toBe(
      'lastName should not be empty',
    );
  });

  it('should validate fail without email', async () => {
    // define a plain object
    const account: Omit<IAccount, 'id' | 'email'> = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };

    // transform to Instance
    const instance = plainToInstance(AccountRegisterArgs, account);

    // validate
    const validationResults = await validate(instance);

    expect(validationResults.length).toBeGreaterThan(0);
    expect(validationResults[0].constraints?.isNotEmpty).toBeDefined();
    expect(validationResults[0].constraints?.isNotEmpty).toBe(
      'email should not be empty',
    );
  });

  it('should validate fail wrong email format', async () => {
    // define a plain object
    const account: Omit<IAccount, 'id'> = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: 'abcdef',
    };

    // transform to Instance
    const instance = plainToInstance(AccountRegisterArgs, account);

    // validate
    const validationResults = await validate(instance);

    expect(validationResults.length).toBeGreaterThan(0);
    expect(validationResults[0].constraints?.isEmail).toBeDefined();
    expect(validationResults[0].constraints?.isEmail).toBe(
      'email must be an email',
    );
    //
  });

  it('should validate success', async () => {
    // define a plain object
    const account: Omit<IAccount, 'id'> = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
    };

    // transform to Instance
    const instance = plainToInstance(AccountRegisterArgs, account);

    // validate
    const validationResults = await validate(instance);

    expect(validationResults.length).toBe(0);
    expect(instance).toMatchObject(account);
  });

  it('should validate success with unknown properties', async () => {
    // define a plain object
    const account: Omit<IAccount, 'id'> & { dob: Date } = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      dob: new Date(),
    };

    // transform to Instance
    const instance = plainToInstance(AccountRegisterArgs, account, {
      excludeExtraneousValues: true,
    });

    // validate
    const validationResults = await validate(instance);

    expect(validationResults.length).toBe(0);
    expect(instance).not.toHaveProperty(['dob']);
  });
});
