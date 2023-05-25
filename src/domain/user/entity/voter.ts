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
  userId?: EntityId;
}

export type VoterCreateData = EntityCreateData<VoterData>;
export type VoterUpdateData = EntityUpdateData<VoterData>;

export class Voter extends BaseEntity<VoterData> implements VoterData {
  get ip() {
    return this.get("ip");
  }
  get userId() {
    return this.get("userId");
  }

  public static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      ip: { type: "string" },
      userId: { type: ["string", "null"] },
    },
    required: [...BaseEntity.jsonSchema.required, "ip"],
    additionalProperties: false,
  };
}
