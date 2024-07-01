import { AccountEntity } from '@/postgresql/entities';
import { faker } from '@faker-js/faker';

export const MOCK_ACCOUNT_ENTITIES: AccountEntity[] = [
  new AccountEntity({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  }),
  new AccountEntity({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  }),
];
