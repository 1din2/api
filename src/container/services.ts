import { Logger } from "../domain/base/logger";
import { ConsoleLogger } from "../domain/service/console-logger";
import { ApiServicesInput } from "./types";
import { CacheStorage } from "../domain/base/cache-storage";
import { UserService } from "../domain/user/service/user-service";
import { UserDbService } from "../services/user/user-service";
import { IdentityService } from "../domain/user/service/identity-service";
import { IdentityDbService } from "../services/user/identity-service";
import { ImageService } from "../domain/image/service/image-service";
import { ImageDbService } from "../services/image/image-service";
import { PollService } from "../domain/poll/service/poll-service";
import { PollDbService } from "../services/poll/poll-service";
import { PollOptionService } from "../domain/poll/service/poll-option-service";
import { PollOptionDbService } from "../services/poll/poll-option-service";

export interface ApiServices {
  logger: Logger;
  user: UserService;
  identity: IdentityService;
  image: ImageService;
  poll: PollService;
  pollOption: PollOptionService;
}

let instance: ApiServices;

const createServices = (
  _cacheStorage: CacheStorage,
  input?: ApiServicesInput
) => {
  const logger = input?.logger ?? ConsoleLogger.Instance;
  const user = input?.user ?? new UserDbService();
  const identity = input?.identity ?? new IdentityDbService();
  const image = input?.image ?? new ImageDbService();
  const poll = input?.poll ?? new PollDbService();
  const pollOption = input?.pollOption ?? new PollOptionDbService();

  const services: ApiServices = {
    logger,
    user,
    identity,
    image,
    poll,
    pollOption,
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
