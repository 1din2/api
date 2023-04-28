import { EntityId } from "../../base/entity";
import { Repository } from "../../base/repository";
import { AccountData, AccountProvider } from "../entity/account";

export interface AccountService extends Repository<AccountData> {
  findByProviderId(
    provider: AccountProvider,
    providerId: string
  ): Promise<AccountData | null>;

  findByUserId(userId: EntityId): Promise<AccountData[]>;
}
