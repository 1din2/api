import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityUpdateData,
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
  uid: string;
  givenName?: string;
  familyName?: string;
  gender?: Gender;
  email?: string;
}

export type UserCreateData = EntityCreateData<UserData>;
export type UserUpdateData = EntityUpdateData<UserData>;

export class User extends BaseEntity<UserData> {
  static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      role: { type: "string", enum: Object.values(UserRole) },
      displayName: { type: "string", minLength: 1, maxLength: 50 },
      uid: { type: "string", minLength: 4, maxLength: 100 },
      givenName: { type: ["string", "null"], minLength: 1, maxLength: 50 },
      familyName: { type: ["string", "null"], minLength: 1, maxLength: 50 },
      gender: { type: ["string", "null"], enum: Object.values(Gender) },
      email: { type: ["string", "null"], format: "email" },
    },
    required: BaseEntity.jsonSchema.required.concat([
      "role",
      "displayName",
      "uid",
    ]),
  };
}
