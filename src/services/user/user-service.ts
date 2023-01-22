import { UserCreateData, UserData } from "../../domain/user/entity/user";
import { UserService } from "../../domain/user/service/user-service";
import { DbRepository } from "../db/repository";

export class UserDbService
  extends DbRepository<UserData>
  implements UserService
{
  constructor() {
    super("User", {});
  }

  async findByUid(uid: string): Promise<UserData | null> {
    const model = await this.query.whereRaw(`lower(uid)=?`, uid).first();
    return model || null;
  }

  override async findUnique(data: UserCreateData): Promise<UserData | null> {
    const user = await this.findByUid(data.uid);
    if (user) return user;

    return super.findUnique(data);
  }
}
