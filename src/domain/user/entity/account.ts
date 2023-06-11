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

export class Account extends BaseEntity<AccountData> implements AccountData {
  get userId() {
    return this.get("userId");
  }

  get provider() {
    return this.get("provider");
  }

  get displayName() {
    return this.get("displayName");
  }

  get givenName() {
    return this.get("givenName");
  }

  get familyName() {
    return this.get("familyName");
  }

  get providerId() {
    return this.get("providerId");
  }

  get emails() {
    return this.get("emails");
  }

  get photos() {
    return this.get("photos");
  }

  get profile() {
    return this.get("profile");
  }

  static toProvider(value: string): AccountProvider {
    const input = value.trim().toLowerCase();
    if (input.startsWith("facebook")) return AccountProvider.FACEBOOK;
    if (input.startsWith("google")) return AccountProvider.GOOGLE;
    throw new Error(`Invalid provider: ${value}`);
  }

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
            items: { type: "string", minLength: 10, maxLength: 500 },
            uniqueItems: true,
            minItems: 0,
            maxItems: 20,
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
