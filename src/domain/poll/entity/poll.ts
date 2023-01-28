import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";
import { dateAddDays } from "../../base/util";

export enum PollStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ENDED = "ENDED",
}

export enum PollType {
  SELECT = "SELECT",
}

export interface PollData extends EntityData {
  userId: EntityId;
  status: PollStatus;
  title: string;
  description?: string;
  imageId?: EntityId;
  minSelect: number;
  maxSelect: number;
  language: string;
  country: string;
  type: PollType;
  endsAt: number;
}

export type PollCreateData = EntityCreateData<PollData>;

export const pollJsonSchema: RequiredJSONSchema = {
  type: "object",
  properties: {
    ...BaseEntity.jsonSchema.properties,
    userId: BaseEntity.jsonSchema.properties.id,
    status: { type: "string", enum: Object.values(PollStatus) },
    title: { type: "string", minLength: 10, maxLength: 200 },
    description: { type: ["null", "string"], minLength: 50, maxLength: 250 },
    imageId: { oneOf: [{ type: "null" }, BaseEntity.jsonSchema.properties.id] },
    minSelect: { type: "integer", minimum: 1, maximum: 10 },
    maxSelect: { type: "integer", minimum: 1, maximum: 10 },
    language: { type: "string", pattern: "^[a-z]{2}$" },
    country: { type: "string", pattern: "^[a-z]{2}$" },
    type: { type: "string", enum: Object.values(PollType) },
    endsAt: {
      type: "integer",
      minimum: new Date().getTime(),
      maximum: dateAddDays(100).getTime(),
    },
  },
  required: BaseEntity.jsonSchema.required.concat([
    "userId",
    "title",
    "status",
    "minSelect",
    "maxSelect",
    "language",
    "country",
    "type",
    "endsAt",
  ]),
};
