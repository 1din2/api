import { Logger } from "../domain/base/logger";
import { ConsoleLogger } from "../domain/service/console-logger";
import { ApiServicesInput } from "./types";
import { CacheStorage } from "../domain/base/cache-storage";
import { UserService } from "../domain/user/service/user-service";
import { UserDbService } from "../services/user/user-db-service";
import { AccountService } from "../domain/user/service/account-service";
import { AccountDbService } from "../services/user/account-db-service";
import { ImageService } from "../domain/image/service/image-service";
import { ImageDbService } from "../services/image/image-db-service";
import { PollService } from "../domain/poll/service/poll-service";
import { PollDbService } from "../services/poll/poll-db-service";
import { PollOptionService } from "../domain/poll/service/poll-option-service";
import { PollOptionDbService } from "../services/poll/poll-option-db-service";
import { PollOptionVoteService } from "../domain/poll/service/poll-option-vote-service";
import { PollOptionVoteDbService } from "../services/poll/poll-option-vote-db-service";
import { VoterService } from "../domain/user/service/voter-service";
import { VoterDbService } from "../services/user/voter-db-service";
import { TagService } from "../domain/poll/service/tag-service";
import { PollTagService } from "../domain/poll/service/poll-tag-service";
import { PollTagDbService } from "../services/poll/poll-tag-db-service";
import { TagDbService } from "../services/poll/tag-db-service";
import { WebImageService } from "../domain/image/service/web-image-service";
import { WebImageDbService } from "../services/image/web-image-db-service";
import { ImageMetadataService } from "../domain/image/service/image-metadata-service";
import { ShartImageMetadataService } from "../services/image/sharp-image-metadata";
import { ImageStorage } from "../domain/image/service/image-storage";
import { S3ImageStorage } from "../services/image/s3-image-storage";
import configuration from "./configuration";

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
  webImage: WebImageService;
  imageMetadata: ImageMetadataService;
  imageStorage: ImageStorage;
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
  const webImage = input?.webImage ?? new WebImageDbService();
  const imageMetadata = input?.imageMetadata ?? new ShartImageMetadataService();
  const imageStorage =
    input?.imageStorage ??
    new S3ImageStorage({
      bucket: configuration.aws_image_s3_buchet,
    });

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
    webImage,
    imageMetadata,
    imageStorage,
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
