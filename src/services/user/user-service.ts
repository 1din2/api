import { User, UserCreateData, UserData } from "../../domain/user/entity/user";
import { UserService } from "../../domain/user/service/user-service";
import { DbRepository } from "../db/repository";

export class UserDbService
  extends DbRepository<UserData, User>
  implements UserService
{
  constructor() {
    super(User);
  }
  async findByEmail(email: string): Promise<User | null> {
    const model = await this.query().where({ email }).first();
    return model ? this.toEntity(model) : null;
  }

  override toEntity(data: UserData): User {
    return new User(data);
  }

  async findByUid(uid: string): Promise<User | null> {
    const model = await this.query().where({ uid }).first();
    return model ? this.toEntity(model) : null;
  }

  override async findUnique(data: UserCreateData): Promise<User | null> {
    let user = await this.findByUid(data.uid);
    if (user) return user;
    if (data.email) {
      user = await this.findByEmail(data.email);
      if (user) return user;
    }

    return super.findUnique(data);
  }
}
