import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IAccount } from './account.interface';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccountRecipe implements IAccount {
  @Field(() => String)
  id: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;
}
