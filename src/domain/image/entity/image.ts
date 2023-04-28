import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
  EntityUpdateData,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";
import { User } from "../../user/entity/user";

export enum ImageProvider {
  S3 = "S3",
}

export interface ImageData extends EntityData {
  contentType: string;
  hash: string;
  provider: ImageProvider;
  color?: string | null;
  height: number;
  width: number;
  originalName?: string | null;
  length?: number | null;
  content?: string | null;
  url?: string;
  userId?: EntityId;
}

export type ImageCreateData = EntityCreateData<ImageData>;
export type ImageUpdateData = EntityUpdateData<ImageData>;

export class Image extends BaseEntity<ImageData> {
  static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      contentType: {
        type: "string",
        pattern: "^image/(jpeg|png|webp)$",
      },
      hash: { type: "string", minLength: 8, maxLength: 40 },
      provider: { type: "string", enum: Object.values(ImageProvider) },
      color: { type: ["null", "string"], pattern: "^[a-z0-9]{6}$" },
      height: { type: ["integer"], minimum: 1 },
      width: { type: ["integer"], minimum: 1 },
      originalName: { type: ["null", "string"], minLength: 1 },
      length: { type: ["null", "integer"], minimum: 1 },
      content: { type: ["null", "string"], minLength: 1 },
      url: { type: ["null", "string"], format: "uri" },
      userId: { oneOf: [{ type: "null" }, User.jsonSchema.properties.id] },
    },
    required: BaseEntity.jsonSchema.required.concat([
      "contentType",
      "hash",
      "provider",
      "height",
      "width",
    ]),
  };
}
