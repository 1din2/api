import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
  EntityUpdateData,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";

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
  slug: string;
  description?: string | null;
  imageId?: EntityId;
  minSelect: number;
  maxSelect: number;
  language: string;
  project: string;
  type: PollType;
  endsAt: string;
}

export type PollCreateData = EntityCreateData<PollData>;
export type PollUpdateData = EntityUpdateData<PollData>;

export class Poll extends BaseEntity<PollData> implements PollData {
  get userId() {
    return this.get("userId");
  }

  get status() {
    return this.get("status");
  }

  get title() {
    return this.get("title");
  }

  get slug() {
    return this.get("slug");
  }

  get description() {
    return this.get("description");
  }

  get imageId() {
    return this.get("imageId");
  }

  get minSelect() {
    return this.get("minSelect");
  }

  get maxSelect() {
    return this.get("maxSelect");
  }

  get language() {
    return this.get("language");
  }

  get project() {
    return this.get("project");
  }

  get type() {
    return this.get("type");
  }

  get endsAt() {
    return this.get("endsAt");
  }

  static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      userId: BaseEntity.jsonSchema.properties.id,
      status: { type: "string", enum: Object.values(PollStatus) },
      title: { type: "string", minLength: 10, maxLength: 200 },
      slug: { type: "string", minLength: 10, maxLength: 100 },
      description: { type: ["null", "string"], minLength: 1, maxLength: 250 },
      imageId: {
        oneOf: [{ type: "null" }, BaseEntity.jsonSchema.properties.id],
      },
      minSelect: { type: "integer", minimum: 1, maximum: 10 },
      maxSelect: { type: "integer", minimum: 1, maximum: 10 },
      language: { type: "string", pattern: "^[a-z]{2}$" },
      project: { type: ["string"], pattern: "^[a-z0-9.]{2,10}$" },
      type: { type: "string", enum: Object.values(PollType) },
      endsAt: { type: "string", format: "date-time" },
    },
    required: BaseEntity.jsonSchema.required.concat([
      "userId",
      "title",
      "slug",
      "status",
      "minSelect",
      "maxSelect",
      "language",
      "project",
      "type",
      "endsAt",
    ]),
  };
}
