import { EntityId } from "../../base/entity";
import { Repository } from "../../base/repository";
import { Account, AccountData, AccountProvider } from "../entity/account";

export interface AccountService extends Repository<AccountData, Account> {
  findByProviderId(
    provider: AccountProvider,
    providerId: string
  ): Promise<Account | null>;

  findByUserId(userId: EntityId): Promise<Account[]>;
}
