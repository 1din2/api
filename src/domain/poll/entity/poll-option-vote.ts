import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
  EntityUpdateData,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";

export interface PollOptionVoteData extends EntityData {
  pollId: EntityId;
  pollOptionId: EntityId;
  userId: EntityId;
}

export type PollOptionVoteCreateData = EntityCreateData<PollOptionVoteData>;
export type PollOptionVoteUpdateData = EntityUpdateData<PollOptionVoteData>;

export class PollOptionVote
  extends BaseEntity<PollOptionVoteData>
  implements PollOptionVoteData
{
  get pollId() {
    return this.get("pollId");
  }

  get pollOptionId() {
    return this.get("pollOptionId");
  }

  get userId() {
    return this.get("userId");
  }

  static override jsonSchema: RequiredJSONSchema = {
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
}
