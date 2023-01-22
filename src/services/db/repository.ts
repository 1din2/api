import {
  EntityData,
  EntityId,
  EntityCreateData,
  EntityUpdateData,
} from "../../domain/base/entity";
import {
  RepositoryEvents,
  BaseRepository,
  RepositoryOptions,
} from "../../domain/base/repository";
import { NotFoundError, ValidationError } from "../../domain/base/errors";
import { dbInstance } from "./db";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DbRepositoryOptions<
  TData extends EntityData,
  TCreate extends EntityCreateData<TData> = EntityCreateData<TData>,
  TUpdate extends EntityUpdateData<TData> = EntityUpdateData<TData>
> extends RepositoryOptions<TCreate, TUpdate> {}

export abstract class DbRepository<
  TData extends EntityData,
  TCreate extends EntityCreateData<TData> = EntityCreateData<TData>,
  TUpdate extends EntityUpdateData<TData> = EntityUpdateData<TData>,
  Events extends RepositoryEvents<TData> = RepositoryEvents<TData>,
  TOptions extends DbRepositoryOptions<
    TData,
    TCreate,
    TUpdate
  > = DbRepositoryOptions<TData, TCreate, TUpdate>
> extends BaseRepository<TData, TCreate, TUpdate, Events, TOptions> {
  constructor(private tableName: string, options: TOptions) {
    super(options);
  }

  protected get query() {
    return dbInstance()(this.tableName);
  }

  getEntityName(): string {
    return this.tableName;
  }

  async deleteByIds(ids: EntityId[]): Promise<number> {
    const items = await this.query.whereIn("id", ids).delete().returning("*");
    return this.onDeletedItems(items);
  }

  protected async innerDelete(id: EntityId): Promise<TData | null> {
    const result = await this.query.where({ id }).delete().returning("*");

    return result.length ? result[0] : null;
  }

  protected async innerCreate(data: TCreate): Promise<TData> {
    const model = await this.query.insert(data).returning("*");

    return model[0];
  }

  protected async innerUpdate(data: TUpdate): Promise<TData> {
    const { id, ...rest } = data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData = rest as any;

    delete updateData["createdAt"];
    delete updateData["updatedAt"];

    if (Object.keys(updateData).length === 0)
      throw new ValidationError(`Update data is empty!`, { data });

    const model = await this.query
      .where({ id })
      .update(updateData)
      .returning("*");

    if (!model.length) {
      throw new NotFoundError(
        `Entity ${this.tableName} with id ${id} not found!`
      );
    }

    return model[0];
  }

  public async findOrCreate(data: TCreate): Promise<TData> {
    const existingEntity = await this.findUnique(data);
    return existingEntity ? existingEntity : this.create(data);
  }

  /**
   * Find unique item.
   */
  public async findUnique(_data: TCreate): Promise<TData | null> {
    return null;
  }

  public async createOrUpdate(data: TCreate): Promise<TData> {
    const exists = await this.findUnique(data);
    if (exists) return this.update({ ...data, id: exists.id } as never);

    return this.create(data);
  }

  public async findById(id: EntityId): Promise<TData | null> {
    const model = await this.query.where({ id }).first();

    return model || null;
  }

  public async findByIds(ids: EntityId[]): Promise<TData[]> {
    if (ids.length === 0) return [];

    return this.query.whereIn("id", ids);
  }

  public async deleteAll(): Promise<number> {
    const items = await this.query.delete().returning("*");
    return this.onDeletedItems(items);
  }

  public async totalCount(): Promise<number> {
    return this.query.count("id");
  }

  public async getAllIds(): Promise<EntityId[]> {
    return this.query.select("id").then((rows) => rows.map((it) => it.id));
  }

  protected async onDeletedItems(items: TData[]) {
    await Promise.all(items.map((item) => this.onDeleted(item)));
    return items.length;
  }
}
