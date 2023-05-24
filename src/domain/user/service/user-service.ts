import { Repository } from "../../base/repository";
import { User, UserData } from "../entity/user";

export interface UserService extends Repository<UserData, User> {
  findByUid(uid: string): Promise<User | null>;
}
