import { Repository } from "../../base/repository";
import { IdentityData, IdentityProvider } from "../entity/identity";

export interface IdentityService extends Repository<IdentityData> {
  findByProviderId(
    provider: IdentityProvider,
    providerId: string
  ): Promise<IdentityData | null>;
}
