import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";

export interface PollOptionVoteData extends EntityData {
  pollId: EntityId;
  pollOptionId: EntityId;
  userId: EntityId;
}

export type PollOptionVoteCreateData = EntityCreateData<PollOptionVoteData>;

export const pollOptionVoteJsonSchema: RequiredJSONSchema = {
  type: "object",
  properties: {
    ...BaseEntity.jsonSchema.properties,
    pollId: BaseEntity.jsonSchema.properties.id,
    pollOptionId: BaseEntity.jsonSchema.properties.id,
    userId: BaseEntity.jsonSchema.properties.id,
  },
  required: BaseEntity.jsonSchema.required.concat([
    "pollId",
    "pollOptionId",
    "userId",
  ]),
};
