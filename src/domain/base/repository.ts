import {
  EntityData,
  EntityId,
  EntityCreateData,
  EntityUpdateData,
} from "./entity";
import { NotFoundError } from "./errors";
import { Emitter, IEmitter } from "./events";
import { Validator } from "./validator";

export interface RepositoryEvents<TData extends EntityData> {
  entityCreated: TData;
  entityUpdated: TData;
  entityDeleted: TData;
  preEntityDelete: EntityId;
}

export interface Repository<
  TData extends EntityData = EntityData,
  TCreate extends EntityCreateData<TData> = EntityCreateData<TData>,
  TUpdate = EntityUpdateData<TData>,
  TEvents extends RepositoryEvents<TData> = RepositoryEvents<TData>
> extends IEmitter<TEvents> {
  /**
   * Delete an entity by id.
   * @param id Entity id to be deleted
   */
  deleteById(id: EntityId): Promise<TData | null>;

  /**
   * Delete an entity by ids.
   * @param ids Entities id to be deleted
   */
  deleteByIds(ids: EntityId[]): Promise<number>;

  /**
   * Create a new entity.
   * @param data Entity data
   */
  create(data: TCreate): Promise<TData>;

  /**
   * Create name entities.
   * @param data Entity data
   */
  createMany(data: TCreate[]): Promise<TData[]>;

  /**
   * Find or create a new entity.
   * @param data Entity data
   */
  findOrCreate(data: TCreate): Promise<TData>;

  /**
   * Update an existing entity.
   * @param data Entity update data
   */
  update(data: TUpdate): Promise<TData>;

  /**
   * Create or update an entity.
   * @param data Entity data
   */
  createOrUpdate(data: TCreate): Promise<TData>;

  /**
   * Find unique entity.
   * @param data Entity data
   */
  findUnique(data: TCreate): Promise<TData | null>;

  /**
   * Get an entity by id.
   * @param id Entity id
   */
  findById(id: EntityId): Promise<TData | null>;

  /**
   * Check entity by id.
   * @param id Entity id
   */
  checkById(id: EntityId): Promise<TData>;

  /**
   * Get an entitis by ids.
   * @param ids Entity ids
   */
  findByIds(ids: EntityId[]): Promise<TData[]>;

  /**
   * Deletes all entities.
   */
  deleteAll(): Promise<number>;

  /**
   * Total items count
   */
  totalCount(): Promise<number>;

  getAllIds(): Promise<EntityId[]>;
}

export interface RepositoryOptions<TCreate, TUpdate> {
  createValidator?: Validator<TCreate>;
  updateValidator?: Validator<TUpdate>;
  deleteValidator?: Validator<EntityId, boolean>;
}

/**
 * Base Repository class. All repository should extend this one.
 */
export abstract class BaseRepository<
    TData extends EntityData,
    TCreate extends EntityCreateData<TData> = EntityCreateData<TData>,
    TUpdate extends EntityUpdateData<TData> = EntityUpdateData<TData>,
    Events extends RepositoryEvents<TData> = RepositoryEvents<TData>,
    TOptions extends RepositoryOptions<TCreate, TUpdate> = RepositoryOptions<
      TCreate,
      TUpdate
    >
  >
  extends Emitter<Events>
  implements Repository<TData, TCreate, TUpdate, Events>
{
  protected readonly options: Readonly<TOptions>;

  public constructor(options: TOptions) {
    super();
    this.options = { ...options };
  }
  abstract deleteByIds(ids: EntityId[]): Promise<number>;
  abstract getEntityName(): string;

  async checkById(id: EntityId): Promise<TData> {
    const entity = await this.findById(id);
    if (!entity)
      throw new NotFoundError(`${this.getEntityName()} ${id} not found!`);
    return entity;
  }

  /**
   * Pre delete operations: validation, etc.
   * @param id Entity id
   */
  protected async preDelete(id: EntityId): Promise<boolean> {
    if (this.options.deleteValidator) {
      if (!(await this.options.deleteValidator.validate(id))) {
        return false;
      }
    }
    return true;
  }

  public async deleteById(id: EntityId) {
    if (!(await this.preDelete(id))) {
      return null;
    }

    await this.onPreDelete(id);

    const entity = await this.innerDelete(id);
    if (entity) await this.onDeleted(entity);

    return entity;
  }

  protected abstract innerDelete(id: EntityId): Promise<TData | null>;

  /**
   * Pre create operations: validation, etc.
   * @param data Entity data
   */
  protected async preCreate(data: TCreate): Promise<TCreate> {
    if (this.options.createValidator) {
      data = await this.options.createValidator.validate(data);
    }
    return data;
  }

  public async create(data: TCreate): Promise<TData> {
    data = await this.preCreate(data);
    const entity = await this.innerCreate(data);

    await this.onCreated(entity);

    return entity;
  }

  public async createMany(data: TCreate[]): Promise<TData[]> {
    return Promise.all(data.map((item) => this.create(item)));
  }

  protected abstract innerCreate(data: TCreate): Promise<TData>;

  /**
   * Pre update operations: validation, etc.
   * @param data Entity data
   */
  protected async preUpdate(data: TUpdate): Promise<TUpdate> {
    if (this.options.updateValidator) {
      data = await this.options.updateValidator.validate(data);
    }
    return data;
  }

  public async update(data: TUpdate): Promise<TData> {
    data = await this.preUpdate(data);
    const entity = await this.innerUpdate(data);

    await this.onUpdated(entity);

    return entity;
  }

  protected abstract innerUpdate(data: TUpdate): Promise<TData>;

  public abstract findUnique(data: TCreate): Promise<TData | null>;
  public abstract findById(id: EntityId): Promise<TData | null>;
  public abstract findByIds(ids: EntityId[]): Promise<TData[]>;
  public abstract findOrCreate(data: TCreate): Promise<TData>;
  public abstract createOrUpdate(data: TCreate): Promise<TData>;

  public abstract deleteAll(): Promise<number>;
  public abstract totalCount(): Promise<number>;
  public abstract getAllIds(): Promise<EntityId[]>;

  /**
   * Fire entityCreated event.
   * @param entity Created entity
   */
  protected async onCreated(entity: TData) {
    return this.emit("entityCreated", entity);
  }

  /**
   * Fire entityDeleted event.
   * @param entity Deleted entity
   */
  protected async onDeleted(entity: TData) {
    return this.emit("entityDeleted", entity);
  }

  /**
   * Fire entityUpdated event.
   * @param entity Updated entity
   */
  protected async onUpdated(entity: TData) {
    return this.emit("entityUpdated", entity);
  }

  /**
   * Fire preEntityDelete event.
   */
  protected async onPreDelete(id: EntityId) {
    return this.emit("preEntityDelete", id);
  }
}
