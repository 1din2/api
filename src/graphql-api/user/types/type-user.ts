import { ObjectType, Field, registerEnumType } from "type-graphql";
import { Gender, UserData, UserRole } from "../../../domain/user/entity/user";
import { TypeBaseEntity } from "../../base/types/types";

registerEnumType(UserRole, { name: "UserRole" });
registerEnumType(Gender, { name: "Gender" });

@ObjectType("PublicUser")
export class TypePublicUser
  extends TypeBaseEntity
  implements Omit<UserData, "uid" | "role">
{
  @Field()
  displayName!: string;
}

@ObjectType("User")
export class TypeUser extends TypePublicUser implements Omit<UserData, "uid"> {
  @Field({ nullable: true })
  givenName?: string;

  @Field({ nullable: true })
  familyName?: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;
}
