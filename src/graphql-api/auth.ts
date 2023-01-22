import { UnauthorizedError } from "type-graphql";
import { ApiContext } from "../container/api-context";
import { UserRole } from "../domain/user/entity/user";

export const checkUserRole = (
  { currentUser }: ApiContext,
  role: UserRole = UserRole.USER
) => {
  if (!currentUser) throw new UnauthorizedError();
  if (role === UserRole.ADMIN && currentUser.role !== role)
    throw new UnauthorizedError();
};
