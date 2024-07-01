import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { keys, set } from 'lodash';

export interface IRepository<Entity extends ObjectLiteral> {
  findById(id: number): Promise<Entity | null>;

  findAll(options?: FindManyOptions<Entity>): Promise<Entity[] | null>;

  create(doc: DeepPartial<Entity>): Entity;

  updateById(id: number, doc: DeepPartial<Entity>): Promise<Entity | null>;

  getRepository(): Repository<Entity>;

  countBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<number>;
}

export class AbstractRepository<Entity extends ObjectLiteral>
  implements IRepository<Entity>
{
  protected readonly repository: Repository<Entity>;
  public readonly dataSource: DataSource;

  constructor(baseRepository: Repository<Entity>, dataSource?: DataSource) {
    this.repository = baseRepository;
    this.dataSource = dataSource;
  }

  async findById(id): Promise<Entity | null> {
    return await this.repository.findOneBy({ id });
  }

  async findAll(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return await this.repository.find(options);
  }

  create(doc: DeepPartial<Entity>): Entity {
    return this.repository.create(doc);
  }

  async updateById(id: number, doc: DeepPartial<Entity>): Promise<Entity> {
    const foundInstance = await this.findById(id);

    keys(doc).forEach((key) => {
      set(foundInstance, key, doc[key]);
    });

    return await foundInstance.save();
  }

  async countBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<number> {
    return await this.repository.countBy(where);
  }

  getRepository(): Repository<Entity> {
    return this.repository;
  }

  getQueryBuilder(
    ClassEntity: EntityTarget<Entity>,
    queryRunner?: QueryRunner,
  ) {
    return queryRunner
      ? queryRunner.manager.getRepository(ClassEntity).createQueryBuilder()
      : this.repository.createQueryBuilder();
  }
}
