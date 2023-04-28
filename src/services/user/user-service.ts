import { JsonValidator } from "../../domain/base/validator";
import { User, UserCreateData, UserData } from "../../domain/user/entity/user";
import { UserService } from "../../domain/user/service/user-service";
import { DbRepository } from "../db/repository";

export class UserDbService
  extends DbRepository<UserData>
  implements UserService
{
  constructor() {
    super("User", {
      createValidator: new JsonValidator(User.jsonSchema),
      updateValidator: new JsonValidator({
        ...User.jsonSchema,
        required: ["id"],
      }),
    });
  }

  async findByUid(uid: string): Promise<UserData | null> {
    const model = await this.query.where({ uid }).first();
    return model || null;
  }

  override async findUnique(data: UserCreateData): Promise<UserData | null> {
    const user = await this.findByUid(data.uid);
    if (user) return user;

    return super.findUnique(data);
  }
}
