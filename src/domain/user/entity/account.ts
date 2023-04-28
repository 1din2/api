import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";
import { User } from "./user";

export enum AccountProvider {
  FACEBOOK = "FACEBOOK",
  GOOGLE = "GOOGLE",
}

export interface AccountData extends EntityData {
  userId: EntityId;
  provider: AccountProvider;
  displayName: string;
  givenName?: string;
  familyName?: string;
  providerId: string;
  emails?: string[];
  photos?: string[];
  profile?: Record<string, unknown>;
}

export type AccountCreateData = EntityCreateData<AccountData>;

export class Account extends BaseEntity<AccountData> {
  static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      userId: User.jsonSchema.properties.id,
      provider: { type: "string", enum: Object.values(AccountProvider) },
      displayName: { type: "string", minLength: 1, maxLength: 50 },
      givenName: { type: ["string", "null"], minLength: 1, maxLength: 50 },
      familyName: { type: ["string", "null"], minLength: 1, maxLength: 50 },
      providerId: { type: "string", minLength: 10, maxLength: 100 },
      emails: {
        oneOf: [
          { type: "null" },
          {
            type: "array",
            items: { type: "string", format: "email" },
            uniqueItems: true,
            minItems: 1,
          },
        ],
      },
      photos: {
        oneOf: [
          { type: "null" },
          {
            type: "array",
            items: { type: "string", minLength: 10, maxLength: 255 },
            uniqueItems: true,
            minItems: 1,
          },
        ],
      },
      profile: { type: ["null", "object"] },
    },
    required: BaseEntity.jsonSchema.required.concat([
      "userId",
      "provider",
      "displayName",
      "providerId",
    ]),
  };
}