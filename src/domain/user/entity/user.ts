import { BaseEntity, EntityCreateData, EntityData } from "../../base/entity";
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
  name: string;
  firstName?: string;
  lastName?: string;
  /** email or provider id */
  uid: string;
  gender?: Gender;
}

export type UserCreateData = EntityCreateData<UserData>;

export const userJsonSchema: RequiredJSONSchema = {
  type: "object",
  properties: {
    ...BaseEntity.jsonSchema.properties,
    role: { type: "string", enum: Object.values(UserRole) },
    name: { type: "string", minLength: 1, maxLength: 50 },
    firstName: { type: ["string", "null"], minLength: 1, maxLength: 50 },
    lastName: { type: ["string", "null"], minLength: 1, maxLength: 50 },
    uid: { type: "string", minLength: 5, maxLength: 100 },
    gender: { type: ["string", "null"], enum: Object.values(Gender) },
  },
  required: BaseEntity.jsonSchema.required.concat(["role", "name", "uid"]),
};
