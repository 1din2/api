import {
  EntityData,
  EntityId,
  EntityCreateData,
  EntityUpdateData,
  BaseEntity,
  EntityConstructor,
} from "../../domain/base/entity";
import {
  RepositoryEvents,
  BaseRepository,
  RepositoryOptions,
} from "../../domain/base/repository";
import { NotFoundError, ValidationError } from "../../domain/base/errors";
import { dbInstance } from "./db";
import { Transaction } from "knex";
import { JsonValidator } from "../../domain/base/validator";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DbRepositoryOptions<
  TData extends EntityData,
  TCreate extends EntityCreateData<TData> = EntityCreateData<TData>,
  TUpdate extends EntityUpdateData<TData> = EntityUpdateData<TData>
> extends RepositoryOptions<TCreate, TUpdate> {}

export abstract class DbRepository<
  TData extends EntityData,
  TEntity extends BaseEntity<TData> = BaseEntity<TData>,
  TCreate extends EntityCreateData<TData> = EntityCreateData<TData>,
  TUpdate extends EntityUpdateData<TData> = EntityUpdateData<TData>,
  Events extends RepositoryEvents<TData, TEntity> = RepositoryEvents<
    TData,
    TEntity
  >
> extends BaseRepository<TData, TEntity, TCreate, TUpdate, Events> {
  protected readonly knex = dbInstance();
  private tableName: string;
  constructor(
    private entityBuilder: EntityConstructor<TData, TEntity>,
    tableName?: string
  ) {
    super({
      createValidator: new JsonValidator(entityBuilder.jsonSchema),
      updateValidator: new JsonValidator({
        ...entityBuilder.jsonSchema,
        required: ["id"],
      }),
    });

    this.tableName = tableName || entityBuilder.tableName();
  }

  protected query(trx?: Transaction) {
    const query = this.knex(this.tableName);
    return trx ? query.transacting(trx) : query;
  }

  getEntityName(): string {
    return this.tableName;
  }

  override toEntity(data: TData): TEntity {
    return new this.entityBuilder(data);
  }

  async transaction<T>(scope: (trx: unknown) => Promise<T> | void) {
    return this.knex.transaction<T>(scope);
  }

  async deleteByIds(ids: EntityId[], trx?: Transaction): Promise<number> {
    const items = await this.query(trx)
      .whereIn("id", ids)
      .delete()
      .returning("*");
    return this.onDeletedItems(items);
  }

  protected async innerDelete(
    id: EntityId,
    trx?: Transaction
  ): Promise<TEntity | null> {
    const result = await this.query(trx).where({ id }).delete().returning("*");

    return result.length ? this.toEntity(result[0]) : null;
  }

  protected async innerCreate(
    data: TCreate,
    trx?: Transaction
  ): Promise<TEntity> {
    const model = await this.query(trx).insert(data).returning("*");

    return this.toEntity(model[0]);
  }

  protected async innerUpdate(
    data: TUpdate,
    trx?: Transaction
  ): Promise<TEntity> {
    const { id, ...rest } = data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData = rest as any;

    delete updateData["createdAt"];
    updateData["updatedAt"] = updateData["updatedAt"] || new Date().toISOString();

    if (Object.keys(updateData).length === 0)
      throw new ValidationError(`Update data is empty!`, { data });

    const model = await this.query(trx)
      .where({ id })
      .update(updateData)
      .returning("*");

    if (!model.length) {
      throw new NotFoundError(
        `Entity ${this.tableName} with id ${id} not found!`
      );
    }

    return this.toEntity(model[0]);
  }

  public async findOrCreate(
    data: TCreate,
    trx?: Transaction
  ): Promise<TEntity> {
    const existingEntity = await this.findUnique(data);
    return existingEntity ? existingEntity : this.create(data, trx);
  }

  /**
   * Find unique item.
   */
  public async findUnique(_data: TCreate): Promise<TEntity | null> {
    return null;
  }

  public async createOrUpdate(
    data: TCreate,
    trx?: Transaction
  ): Promise<TEntity> {
    const exists = await this.findUnique(data);
    if (exists) return this.update({ ...data, id: exists.id } as never, trx);

    return this.create(data, trx);
  }

  public async findById(id: EntityId): Promise<TEntity | null> {
    const model = await this.query().where({ id }).first();

    return model ? this.toEntity(model) : null;
  }

  public async findByIds(ids: EntityId[]): Promise<TEntity[]> {
    if (ids.length === 0) return [];

    const items = await this.query().whereIn("id", ids);

    return this.toEntities(items);
  }

  public async deleteAll(): Promise<number> {
    const items = await this.query().delete().returning("*");
    return this.onDeletedItems(items);
  }

  public async totalCount(): Promise<number> {
    return this.query().count("id");
  }

  public async getAllIds(): Promise<EntityId[]> {
    return this.query()
      .select("id")
      .then((rows) => rows.map((it) => it.id));
  }

  protected async onDeletedItems(items: TEntity[]) {
    await Promise.all(items.map((item) => this.onDeleted(item)));
    return items.length;
  }
}
