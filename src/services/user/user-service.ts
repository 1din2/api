import { EntityId } from "../../domain/base/entity";
import { JsonValidator } from "../../domain/base/validator";
import {
  UserCreateData,
  UserData,
  userJsonSchema,
} from "../../domain/user/entity/user";
import { UserService } from "../../domain/user/service/user-service";
import { DbRepository } from "../db/repository";

export class UserDbService
  extends DbRepository<UserData>
  implements UserService
{
  constructor() {
    super("User", {
      createValidator: new JsonValidator(userJsonSchema),
      updateValidator: new JsonValidator({
        ...userJsonSchema,
        required: ["id"],
      }),
    });
  }

  async findByIdentityId(identityId: EntityId): Promise<UserData | null> {
    const model = await this.query.where({ identityId }).first();
    return model || null;
  }

  override async findUnique(data: UserCreateData): Promise<UserData | null> {
    const user = await this.findByIdentityId(data.identityId);
    if (user) return user;

    return super.findUnique(data);
  }
}
