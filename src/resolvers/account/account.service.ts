import { Inject, Injectable } from '@nestjs/common';
import { AccountRegisterArgs } from './account.args';
import {
  IAccountRepository,
  I_ACCOUNT_REPOSITORY,
} from '@/postgresql/repositories/account.repository';
import { IAccountEntity } from '@/postgresql/entities/account.entity';

export const I_ACCOUNT_SERVICE = 'I_ACCOUNT_SERVICE';

@Injectable()
export class AccountService {
  constructor(
    @Inject(I_ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository<IAccountEntity>,
  ) {}

  public async register(accountRegisterArgs: AccountRegisterArgs) {
    const account = await this.accountRepository.findByEmail(
      accountRegisterArgs.email,
    );

    if (account) {
      throw new Error('Email already exist');
    }

    return this.accountRepository.saveAccount({
      ...accountRegisterArgs,
    });
  }

  public getAccounts() {
    return this.accountRepository.findAll();
  }
}
