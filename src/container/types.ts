import { Logger } from "../domain/base/logger";
import { DomainContext } from "../domain/base/usecase";
import { ImageMetadataService } from "../domain/image/service/image-metadata-service";
import { ImageService } from "../domain/image/service/image-service";
import { ImageStorage } from "../domain/image/service/image-storage";
import { WebImageService } from "../domain/image/service/web-image-service";
import { PollOptionService } from "../domain/poll/service/poll-option-service";
import { PollOptionVoteService } from "../domain/poll/service/poll-option-vote-service";
import { PollService } from "../domain/poll/service/poll-service";
import { PollTagService } from "../domain/poll/service/poll-tag-service";
import { TagService } from "../domain/poll/service/tag-service";
import { AccountService } from "../domain/user/service/account-service";
import { UserService } from "../domain/user/service/user-service";
import { VoterService } from "../domain/user/service/voter-service";

export type ApiServicesInput = {
  logger?: Logger;
  user?: UserService;
  account?: AccountService;
  image?: ImageService;
  poll?: PollService;
  pollOption?: PollOptionService;
  pollOptionVote?: PollOptionVoteService;
  voter?: VoterService;
  tag?: TagService;
  pollTag?: PollTagService;
  webImage?: WebImageService;
  imageMetadata?: ImageMetadataService;
  imageStorage?: ImageStorage;
};

export type ApiUserData = Pick<
  DomainContext,
  "language" | "isAuthenticated" | "project" | "ip"
>;

export type ApiContextInput = ApiUserData & { services?: ApiServicesInput };
