import { Logger } from "../domain/base/logger";
import { ConsoleLogger } from "../domain/service/console-logger";
import { ApiServicesInput } from "./types";
import { CacheStorage } from "../domain/base/cache-storage";
import { UserService } from "../domain/user/service/user-service";
import { UserDbService } from "../services/user/user-service";
import { AccountService } from "../domain/user/service/account-service";
import { AccountDbService } from "../services/user/account-service";
import { ImageService } from "../domain/image/service/image-service";
import { ImageDbService } from "../services/image/image-service";
import { PollService } from "../domain/poll/service/poll-service";
import { PollDbService } from "../services/poll/poll-service";
import { PollOptionService } from "../domain/poll/service/poll-option-service";
import { PollOptionDbService } from "../services/poll/poll-option-service";
import { PollOptionVoteService } from "../domain/poll/service/poll-option-vote-service";
import { PollOptionVoteDbService } from "../services/poll/poll-option-vote-service";
import { VoterService } from "../domain/user/service/voter-service";
import { VoterDbService } from "../services/user/voter-service";
import { TagService } from "../domain/poll/service/tag-service";
import { PollTagService } from "../domain/poll/service/poll-tag-service";
import { PollTagDbService } from "../services/poll/poll-tag-service";
import { TagDbService } from "../services/poll/tag-service";

export interface ApiServices {
  logger: Logger;
  user: UserService;
  account: AccountService;
  image: ImageService;
  poll: PollService;
  pollOption: PollOptionService;
  pollOptionVote: PollOptionVoteService;
  voter: VoterService;
  tag: TagService;
  pollTag: PollTagService;
}

let instance: ApiServices;

const createServices = (
  _cacheStorage: CacheStorage,
  input?: ApiServicesInput
) => {
  const logger = input?.logger ?? ConsoleLogger.Instance;
  const user = input?.user ?? new UserDbService();
  const identity = input?.account ?? new AccountDbService();
  const image = input?.image ?? new ImageDbService();
  const poll = input?.poll ?? new PollDbService();
  const pollOption = input?.pollOption ?? new PollOptionDbService();
  const pollOptionVote = input?.pollOptionVote ?? new PollOptionVoteDbService();
  const voter = input?.voter ?? new VoterDbService();
  const tag = input?.tag ?? new TagDbService();
  const pollTag = input?.pollTag ?? new PollTagDbService();

  const services: ApiServices = {
    logger,
    user,
    account: identity,
    image,
    poll,
    pollOption,
    pollOptionVote,
    voter,
    tag,
    pollTag,
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
