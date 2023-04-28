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
  extends DbRepository<AccountData>
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

  async findByUserId(userId: string): Promise<AccountData[]> {
    const models = await this.query.where({ userId });
    return models;
  }

  async findByProviderId(
    provider: AccountProvider,
    providerId: string
  ): Promise<AccountData | null> {
    const model = await this.query.where({ provider, providerId }).first();
    return model || null;
  }

  override async findUnique(
    data: AccountCreateData
  ): Promise<AccountData | null> {
    const user = await this.findByProviderId(data.provider, data.providerId);
    if (user) return user;

    return super.findUnique(data);
  }
}
