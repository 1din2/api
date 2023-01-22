import { Constructor } from "./types";
import { RequiredJSONSchema } from "./json-schema";
import { generateUniqueId } from "./util";

/**
 * Entity id type.
 */
export type EntityId = number;

/**
 * Root entity data.
 */
export interface EntityData {
  id: EntityId;
  createdAt: number;
  updatedAt?: number | null;
}

export type EntityCreateData<T extends EntityData> = Omit<
  T,
  "createdAt" | "updatedAt" | "id"
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
    this._data = {} as never;
    this.setData(data);
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
    value = this.formatFieldValue(prop, value);
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

  protected formatFieldValue<TProp extends keyof TData>(
    prop: TProp,
    value: TData[TProp]
  ): TData[TProp] {
    if (
      (typeof value === "string" || typeof value === "number") &&
      this.isDateField(prop as string)
    )
      return new Date(value) as never;

    return value;
  }

  protected isDateField(name: string) {
    return this.getDateFields().includes(name);
  }

  protected getDateFields() {
    return ["createdAt", "updatedAt"];
  }

  public static createId(_input?: unknown) {
    return generateUniqueId();
  }

  public static readonly jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      id: { type: "integer", minimum: 1, maximum: Number.MAX_SAFE_INTEGER },
      createdAt: { type: "integer" },
      updatedAt: { type: "integer" },
    },
    required: [],
  };

  toJson(): Record<keyof TData, unknown> {
    const data = this.getData();
    const json = { ...data };

    return json;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EntityConstructor<E extends Entity> extends Constructor<E> {}
