import { ObjectType, Field, registerEnumType } from "type-graphql";
import { Gender, UserData, UserRole } from "../../../domain/user/entity/user";
import { TypeBaseEntity } from "../../base/types/types";

registerEnumType(UserRole, { name: "UserRole" });
registerEnumType(Gender, { name: "Gender" });

@ObjectType("PublicUser")
export class TypePublicUser
  extends TypeBaseEntity
  implements Omit<UserData, "uid" | "role" | "project">
{
  @Field()
  displayName!: string;
}

@ObjectType("User")
export class TypeUser
  extends TypePublicUser
  implements Omit<UserData, "uid" | "project">
{
  @Field({ nullable: true })
  givenName?: string;

  @Field({ nullable: true })
  familyName?: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Field(() => String, { nullable: true })
  email?: string;
}
