import { ObjectType, Field, registerEnumType } from "type-graphql";
import { UserData, UserRole } from "../../../domain/user/entity/user";
import { TypeBaseEntity } from "../../base/types/types";

registerEnumType(UserRole, { name: "UserRole" });

@ObjectType("User")
export class TypeUser
  extends TypeBaseEntity
  implements Omit<UserData, "identityId">
{
  @Field()
  displayName!: string;

  @Field({ nullable: true })
  givenName?: string;

  @Field({ nullable: true })
  familyName?: string;

  @Field(() => UserRole)
  role!: UserRole;
}
