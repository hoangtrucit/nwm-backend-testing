import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export interface IAccountEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Entity({ name: 'account' })
export class AccountEntity
  extends AbstractEntity<AccountEntity>
  implements IAccountEntity
{
  @PrimaryColumn({ type: 'uuid', name: 'id' })
  id: string;

  @Column({ type: 'varchar', name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;
}
