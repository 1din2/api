import faker from "faker";
import {
  UserCreateData,
  UserData,
  UserRole,
} from "../../domain/user/entity/user";
import { ApiContext } from "../../container/api-context";
import { EntityId } from "../../domain/base/entity";
import { generateShortUniqueId } from "../../domain/base/util";

export const createUserData = (
  identityId: number,
  args?: Partial<UserCreateData>
): UserCreateData => ({
  identityId,
  uid: generateShortUniqueId(),
  displayName: faker.name.findName(),
  role: UserRole.USER,
  ...args,
});

export const deleteUser = async (
  userOrId: EntityId | UserData,
  context: ApiContext
) => {
  const userId = typeof userOrId === "number" ? userOrId : userOrId.id;

  await context.services.user.deleteById(userId);
};
