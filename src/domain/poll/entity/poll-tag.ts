import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
  EntityUpdateData,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";

export interface PollTagData extends EntityData {
  pollId: EntityId;
  tagId: EntityId;
  pollOptionId?: EntityId;
}

export type PollTagCreateData = EntityCreateData<PollTagData>;
export type PollTagUpdateData = EntityUpdateData<PollTagData>;

export class PollTag extends BaseEntity<PollTagData> implements PollTagData {
  get pollId() {
    return this.get("pollId");
  }

  get tagId() {
    return this.get("tagId");
  }

  get pollOptionId() {
    return this.get("pollOptionId");
  }

  public static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      pollId: BaseEntity.jsonSchema.properties.id,
      tagId: BaseEntity.jsonSchema.properties.id,
      pollOptionId: {
        oneOf: [BaseEntity.jsonSchema.properties.id, { type: "null" }],
      },
    },
    required: BaseEntity.jsonSchema.required.concat(["pollId", "tagId"]),
    additionalProperties: false,
  };
}
