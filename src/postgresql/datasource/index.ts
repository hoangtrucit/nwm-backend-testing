import { DataSource } from 'typeorm';

export const dataSourceRepository = new DataSource({
  type: 'postgres',
});
