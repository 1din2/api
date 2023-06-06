import { UnauthorizedError } from "type-graphql";
import { ApiContext } from "../container/api-context";
import { UserRole } from "../domain/user/entity/user";
import { InvalidInputError } from "../domain/base/errors";

export const checkUserRole = (
  { currentUser }: ApiContext,
  role: UserRole = UserRole.USER
) => {
  if (!currentUser) throw new UnauthorizedError();
  if (role === UserRole.ADMIN && currentUser.role !== role)
    throw new UnauthorizedError();
};

export const checkProject = (project?: string): string => {
  if (!project) throw new InvalidInputError(`Project not found`);
  return project;
};
