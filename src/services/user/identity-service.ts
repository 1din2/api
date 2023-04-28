import { JsonValidator } from "../../domain/base/validator";
import {
  Identity,
  IdentityCreateData,
  IdentityData,
  IdentityProvider,
} from "../../domain/user/entity/identity";
import { IdentityService } from "../../domain/user/service/identity-service";
import { DbRepository } from "../db/repository";

export class IdentityDbService
  extends DbRepository<IdentityData>
  implements IdentityService
{
  constructor() {
    super("Identity", {
      createValidator: new JsonValidator(Identity.jsonSchema),
      updateValidator: new JsonValidator({
        ...Identity.jsonSchema,
        required: ["id"],
      }),
    });
  }

  async findByUserId(userId: string): Promise<IdentityData[]> {
    const models = await this.query.where({ userId });
    return models;
  }

  async findByProviderId(
    provider: IdentityProvider,
    providerId: string
  ): Promise<IdentityData | null> {
    const model = await this.query.where({ provider, providerId }).first();
    return model || null;
  }

  override async findUnique(
    data: IdentityCreateData
  ): Promise<IdentityData | null> {
    const user = await this.findByProviderId(data.provider, data.providerId);
    if (user) return user;

    return super.findUnique(data);
  }
}
