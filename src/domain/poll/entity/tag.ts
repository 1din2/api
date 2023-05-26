import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityUpdateData,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";

export interface TagData extends EntityData {
  name: string;
  slug: string;
  language: string;
  description?: string;
}

export type TagCreateData = EntityCreateData<TagData>;
export type TagUpdateData = EntityUpdateData<TagData>;

export class Tag extends BaseEntity<TagData> implements TagData {
  get name() {
    return this.get("name");
  }

  get slug() {
    return this.get("slug");
  }

  get description() {
    return this.get("description");
  }

  get language() {
    return this.get("language");
  }

  public static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      name: { type: "string", minLength: 1, maxLength: 50 },
      slug: { type: "string", minLength: 1, maxLength: 50 },
      description: { type: "string", minLength: 1, maxLength: 255 },
      language: { type: "string", pattern: "^[a-z]{2}$" },
    },
    required: BaseEntity.jsonSchema.required.concat([
      "name",
      "slug",
      "language",
    ]),
    additionalProperties: false,
  };
}
