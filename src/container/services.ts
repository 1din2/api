import { Logger } from "../domain/base/logger";
import { ConsoleLogger } from "../domain/service/console-logger";
import { ApiServicesInput } from "./types";
import { CacheStorage } from "../domain/base/cache-storage";
import { UserService } from "../domain/user/service/user-service";
import { UserDbService } from "../services/user/user-service";
import { IdentityService } from "../domain/user/service/identity-service";
import { IdentityDbService } from "../services/user/identity-service";

export interface ApiServices {
  logger: Logger;
  user: UserService;
  identity: IdentityService;
}

let instance: ApiServices;

const createServices = (
  _cacheStorage: CacheStorage,
  input?: ApiServicesInput
) => {
  const logger = input?.logger ?? ConsoleLogger.Instance;
  const user = input?.user ?? new UserDbService();
  const identity = input?.identity ?? new IdentityDbService();

  const services: ApiServices = {
    logger,
    user,
    identity,
  };

  return services;
};

export const getApiServices = (
  cacheStorage: CacheStorage,
  input?: ApiServicesInput
) => {
  if (instance) return instance;

  instance = createServices(cacheStorage, input);

  return instance;
};
