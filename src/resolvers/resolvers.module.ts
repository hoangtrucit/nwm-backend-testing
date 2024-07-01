import { Module } from '@nestjs/common';
import { AccountResolver } from './account/account.resolver';
import { AccountService, I_ACCOUNT_SERVICE } from './account/account.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    AccountResolver,
    {
      provide: I_ACCOUNT_SERVICE,
      useClass: AccountService,
    },
  ],
})
export class ResolversModule {}
