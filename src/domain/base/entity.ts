import { Constructor } from "./types";
import { RequiredJSONSchema } from "./json-schema";
import { generateUniqueId } from "./util";

/**
 * Entity id type.
 */
export type EntityId = string;

/**
 * Root entity data.
 */
export interface EntityData {
  id: EntityId;
  createdAt: string;
  updatedAt: string;
}

export type EntityCreateData<T extends EntityData> = Omit<
  T,
  "createdAt" | "updatedAt"
>;

export type EntityUpdateData<T extends EntityData> = Partial<
  Omit<T, "createdAt" | "updatedAt" | "id">
> & { id: EntityId };

export interface Entity<TData extends EntityData = EntityData> {
  /**
   * Get entity data.
   */
  getData(): TData;

  /**
   * Set property value.
   * @param prop Property name
   * @param value Property value
   */
  set<TProp extends keyof TData>(prop: TProp, value: TData[TProp]): this;

  /**
   * Get property value.
   * @param prop Property name
   */
  get<TProp extends keyof TData>(prop: TProp): TData[TProp];
}

/**
 * Base entity class.
 * All entities should extend BaseEntity.
 */
export class BaseEntity<TData extends EntityData = EntityData>
  implements Entity<TData>
{
  protected readonly _data: TData;

  public constructor(data: TData) {
    this._data = { ...data };
    // this.setData(data);
  }

  public get id() {
    return this.get("id");
  }
  public set id(value: TData["id"]) {
    this.set("id", value);
  }
  public get createdAt() {
    return this.get("createdAt");
  }
  public set createdAt(value: TData["createdAt"]) {
    this.set("createdAt", value);
  }
  public get updatedAt() {
    return this.get("updatedAt");
  }
  public set updatedAt(value: TData["updatedAt"]) {
    this.set("updatedAt", value);
  }

  public getData() {
    return this._data;
  }

  public setData(data: Partial<TData>) {
    Object.keys(data).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.set(key as keyof TData, data[key as keyof TData] as any);
    });
    return this._data;
  }

  public set<TProp extends keyof TData>(prop: TProp, value: TData[TProp]) {
    if (value === undefined) {
      delete this._data[prop];
    } else {
      this._data[prop] = value;
    }
    return this;
  }

  public get<TProp extends keyof TData>(prop: TProp) {
    return this._data[prop];
  }

  public static createId(_input?: unknown) {
    return generateUniqueId();
  }

  public static readonly jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", pattern: "^[a-z0-9]{26}$" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
    required: ["id"],
  };

  toJson(): Record<keyof TData, unknown> {
    const data = this.getData();
    const json = { ...data };

    return json;
  }

  public static tableName() {
    return this.name;
  }
}

export interface EntityConstructor<D extends EntityData, E extends Entity<D>>
  extends Constructor<E, D> {
  readonly jsonSchema: RequiredJSONSchema;
  tableName(): string;
}
