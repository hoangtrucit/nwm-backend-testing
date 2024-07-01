// Libs importing
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, QueryRunner, Repository } from 'typeorm';

// repository importing
import { AbstractRepository, IRepository } from './abstract.repository';

// entity importing
import { IAccountEntity, AccountEntity } from '../entities/account.entity';
import { RepositoryError } from './error.repository';
import { dataSourceRepository } from '../datasource';
import { IAccount } from '@/resolvers/account/account.interface';

export const I_ACCOUNT_REPOSITORY = 'I_ACCOUNT_REPOSITORY';

export interface IAccountRepository<Entity extends ObjectLiteral>
  extends IRepository<Entity> {
  findByEmail(email: string): Promise<Entity | null>;
  saveAccount(account: Omit<IAccount, 'id'>): Promise<Entity>;
}

@Injectable()
export class AccountRepository
  extends AbstractRepository<AccountEntity>
  implements IAccountRepository<IAccountEntity>
{
  constructor(
    @InjectRepository(AccountEntity)
    repository: Repository<AccountEntity>,
  ) {
    super(repository, dataSourceRepository);
  }

  async findByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
    });
  }

  async saveAccount(account: Omit<IAccount, 'id'>) {
    const entity = this.create(account);

    const result = await this.repository
      .createQueryBuilder()
      .insert()
      .values(entity)
      .returning('*')
      .execute();

    return this.create(result.generatedMaps[0]);
  }
}
