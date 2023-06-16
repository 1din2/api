import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
  EntityUpdateData,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";
import { Voter } from "../../user/entity/voter";

export interface PollOptionVoteData extends EntityData {
  pollId: EntityId;
  pollOptionId: EntityId;
  ip: string;
  voterId: EntityId;
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

  get ip() {
    return this.get("ip");
  }

  get voterId() {
    return this.get("voterId");
  }

  static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      pollId: BaseEntity.jsonSchema.properties.id,
      pollOptionId: BaseEntity.jsonSchema.properties.id,
      ip: { type: "string" },
      voterId: Voter.jsonSchema.properties.id,
    },
    required: BaseEntity.jsonSchema.required.concat([
      "pollId",
      "pollOptionId",
      "ip",
      "voterId",
    ]),
  };
}
