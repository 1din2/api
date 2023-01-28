import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityId,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface UserData extends EntityData {
  role: UserRole;
  displayName: string;
  givenName?: string;
  familyName?: string;
  identityId: EntityId;
  gender?: Gender;
}

export type UserCreateData = EntityCreateData<UserData>;

export const userJsonSchema: RequiredJSONSchema = {
  type: "object",
  properties: {
    ...BaseEntity.jsonSchema.properties,
    role: { type: "string", enum: Object.values(UserRole) },
    displayName: { type: "string", minLength: 1, maxLength: 50 },
    givenName: { type: ["string", "null"], minLength: 1, maxLength: 50 },
    familyName: { type: ["string", "null"], minLength: 1, maxLength: 50 },
    identityId: BaseEntity.jsonSchema.properties.id,
    gender: { type: ["string", "null"], enum: Object.values(Gender) },
  },
  required: BaseEntity.jsonSchema.required.concat([
    "role",
    "displayName",
    "identityId",
  ]),
};
