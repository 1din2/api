import { ObjectType, Field, registerEnumType } from "type-graphql";
import { UserData, UserRole } from "../../../domain/user/entity/user";
import { TypeBaseEntity } from "../../base/types/types";

registerEnumType(UserRole, { name: "UserRole" });

@ObjectType("User")
export class TypeUser extends TypeBaseEntity implements Omit<UserData, "uid"> {
  @Field()
  name!: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(() => UserRole)
  role!: UserRole;
}
