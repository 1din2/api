import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";

export interface PollOptionData extends EntityData {
  pollId: EntityId;
  title: string;
  priority: number;
  description?: string;
  imageId?: EntityId;
}

export type PollOptionCreateData = EntityCreateData<PollOptionData>;

export const pollOptionJsonSchema: RequiredJSONSchema = {
  type: "object",
  properties: {
    ...BaseEntity.jsonSchema.properties,
    pollId: BaseEntity.jsonSchema.properties.id,
    title: { type: "string", minLength: 1, maxLength: 100 },
    priority: { type: "integer", minimum: 0, maximum: 100 },
    description: { type: ["null", "string"], minLength: 10, maxLength: 200 },
    imageId: { oneOf: [{ type: "null" }, BaseEntity.jsonSchema.properties.id] },
  },
  required: BaseEntity.jsonSchema.required.concat([
    "pollId",
    "title",
    "priority",
  ]),
};
