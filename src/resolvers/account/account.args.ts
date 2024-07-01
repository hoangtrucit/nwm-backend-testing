import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IAccount } from './account.interface';
import { Exclude, Expose } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';

@Exclude()
@InputType()
export class AccountRegisterArgs implements Omit<IAccount, 'id'> {
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Field()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  @Field()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  @Field()
  email: string;
}
