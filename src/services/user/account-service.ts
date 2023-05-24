import { JsonValidator } from "../../domain/base/validator";
import {
  Account,
  AccountCreateData,
  AccountData,
  AccountProvider,
} from "../../domain/user/entity/account";
import { AccountService } from "../../domain/user/service/account-service";
import { DbRepository } from "../db/repository";

export class AccountDbService
  extends DbRepository<AccountData, Account>
  implements AccountService
{
  constructor() {
    super("Account", {
      createValidator: new JsonValidator(Account.jsonSchema),
      updateValidator: new JsonValidator({
        ...Account.jsonSchema,
        required: ["id"],
      }),
    });
  }

  override toEntity(data: AccountData): Account {
    return new Account(data);
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const models = await this.query().where({ userId });
    return this.toEntities(models);
  }

  async findByProviderId(
    provider: AccountProvider,
    providerId: string
  ): Promise<Account | null> {
    const model = await this.query().where({ provider, providerId }).first();
    return model ? this.toEntity(model) : null;
  }

  override async findUnique(data: AccountCreateData): Promise<Account | null> {
    const user = await this.findByProviderId(data.provider, data.providerId);
    if (user) return user;

    return super.findUnique(data);
  }
}
