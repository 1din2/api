import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
  EntityUpdateData,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";
import { md5 } from "../../base/util";

export interface WebImageData extends EntityData {
  url: string;
  width: number;
  height: number;
  hostname: string;
  urlHash: string;
  pollId?: EntityId;
  pollOptionId?: EntityId;
  query?: string;
}

export type WebImageCreateData = EntityCreateData<WebImageData>;
export type WebImageUpdateData = EntityUpdateData<WebImageData>;

export class WebImage extends BaseEntity<WebImageData> implements WebImageData {
  get hostname() {
    return this.get("hostname");
  }

  get urlHash() {
    return this.get("urlHash");
  }

  get height() {
    return this.get("height");
  }

  get width() {
    return this.get("width");
  }

  get url() {
    return this.get("url");
  }

  get pollId() {
    return this.get("pollId");
  }

  get pollOptionId() {
    return this.get("pollOptionId");
  }

  get query() {
    return this.get("query");
  }

  static createHash(url: string) {
    return md5(url);
  }

  static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      hostname: {
        type: "string",
        minLength: 3,
        maxLength: 100,
      },
      urlHash: { type: "string", minLength: 8, maxLength: 40 },
      height: { type: ["integer"], minimum: 100 },
      width: { type: ["integer"], minimum: 100 },
      url: { type: ["null", "string"], format: "uri" },
      pollId: { type: ["null", "string"] },
      pollOptionId: { type: ["null", "string"] },
      query: { type: ["null", "string"] },
    },
    required: BaseEntity.jsonSchema.required.concat([
      "hostname",
      "urlHash",
      "url",
      "height",
      "width",
    ]),
  };
}
