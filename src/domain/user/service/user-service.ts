import { EntityId } from "../../base/entity";
import { Repository } from "../../base/repository";
import { UserData } from "../entity/user";

export interface UserService extends Repository<UserData> {
  findByIdentityId(identityId: EntityId): Promise<UserData | null>;
}
