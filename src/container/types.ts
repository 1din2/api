import { Logger } from "../domain/base/logger";
import { DomainContext } from "../domain/base/usecase";
import { IdentityService } from "../domain/user/service/identity-service";
import { UserService } from "../domain/user/service/user-service";

export type ApiServicesInput = {
  logger?: Logger;
  user?: UserService;
  identity?: IdentityService;
};

export type ApiUserData = Pick<DomainContext, "language" | "isAuthenticated">;

export type ApiContextInput = ApiUserData & { services?: ApiServicesInput };
