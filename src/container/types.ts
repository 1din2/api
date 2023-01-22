import { Logger } from "../domain/base/logger";
import { DomainContext } from "../domain/base/usecase";
import { UserService } from "../domain/user/service/user-service";

export type ApiServicesInput = {
  logger?: Logger;
  user?: UserService;
};

export type ApiUserData = Pick<DomainContext, "language" | "isAuthenticated">;

export type ApiContextInput = ApiUserData & { services?: ApiServicesInput };
