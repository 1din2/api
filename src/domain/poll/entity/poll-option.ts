import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
  EntityUpdateData,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";
import { Image } from "../../image/entity/image";

export interface PollOptionData extends EntityData {
  pollId: EntityId;
  title: string;
  priority: number;
  description?: string | null;
  imageId?: EntityId | null;
  color?: string | null;
}

export type PollOptionCreateData = EntityCreateData<PollOptionData>;
export type PollOptionUpdateData = EntityUpdateData<PollOptionData>;

export class PollOption
  extends BaseEntity<PollOptionData>
  implements PollOptionData
{
  get pollId() {
    return this.get("pollId");
  }

  get title() {
    return this.get("title");
  }

  get priority() {
    return this.get("priority");
  }

  get description() {
    return this.get("description");
  }

  get imageId() {
    return this.get("imageId");
  }

  get color() {
    return this.get("color");
  }

  static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      pollId: BaseEntity.jsonSchema.properties.id,
      title: { type: "string", minLength: 1, maxLength: 100 },
      priority: { type: "integer", minimum: 0, maximum: 100 },
      description: { type: ["null", "string"], minLength: 1, maxLength: 200 },
      imageId: { oneOf: [{ type: "null" }, Image.jsonSchema.properties.id] },
      color: { type: ["string", "null"], pattern: "^#[0-9a-fA-F]{6}$" },
    },
    required: BaseEntity.jsonSchema.required.concat([
      "pollId",
      "title",
      "priority",
    ]),
  };
}
