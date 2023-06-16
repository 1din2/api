import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
  EntityUpdateData,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";

export interface VoterData extends EntityData {
  ip: string;
  uid: string;
  userId?: EntityId;
}

export type VoterCreateData = EntityCreateData<VoterData>;
export type VoterUpdateData = EntityUpdateData<VoterData>;

export class Voter extends BaseEntity<VoterData> implements VoterData {
  get ip() {
    return this.get("ip");
  }
  get uid() {
    return this.get("uid");
  }
  get userId() {
    return this.get("userId");
  }

  public static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      ip: { type: "string" },
      uid: { type: "string", pattern: "^[a-z]{4}\\d{10}$" },
      userId: { type: ["string", "null"] },
    },
    required: [...BaseEntity.jsonSchema.required, "ip", "uid"],
    additionalProperties: false,
  };
}
