import { Repository } from "../../base/repository";
import { UserData } from "../entity/user";

export interface UserService extends Repository<UserData> {
  findByUid(uid: string): Promise<UserData | null>;
}
