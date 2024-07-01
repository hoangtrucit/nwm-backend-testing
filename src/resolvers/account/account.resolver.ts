import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountRecipe } from './account.receipe';
import { AccountRegisterArgs } from './account.args';
import { faker } from '@faker-js/faker';
import { Inject } from '@nestjs/common';
import { AccountService, I_ACCOUNT_SERVICE } from './account.service';
import { GraphQLError } from 'graphql';

@Resolver(() => AccountRecipe)
export class AccountResolver {
  constructor(
    @Inject(I_ACCOUNT_SERVICE)
    private accountService: AccountService,
  ) {
    //
  }

  @Mutation(() => AccountRecipe, { name: 'register' })
  public async register(
    @Args('accountRegisterArgs') accountRegisterArgs: AccountRegisterArgs,
  ) {
    try {
      return this.accountService.register(accountRegisterArgs);
    } catch (error) {
      throw new GraphQLError(error.message);
    }
  }

  @Query(() => [AccountRecipe], { name: 'users' })
  public async users() {
    try {
      return await this.accountService.getAccounts();
    } catch (error) {
      throw new GraphQLError(error.message);
    }
  }
}
