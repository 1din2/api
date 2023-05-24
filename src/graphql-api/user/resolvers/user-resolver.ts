import { Resolver, Ctx, Query } from "type-graphql";
import { ApiContext } from "../../../container/api-context";
import { TypeUser } from "../types/type-user";

@Resolver(() => TypeUser)
export default class UserResolver {
  @Query(() => TypeUser, { nullable: true })
  me(@Ctx() { currentUser }: ApiContext) {
    return currentUser;
  }
}
