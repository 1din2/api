import { Logger } from "../domain/base/logger";
import { DomainContext } from "../domain/base/usecase";
import { ImageService } from "../domain/image/service/image-service";
import { PollOptionService } from "../domain/poll/service/poll-option-service";
import { PollOptionVoteService } from "../domain/poll/service/poll-option-vote-service";
import { PollService } from "../domain/poll/service/poll-service";
import { IdentityService } from "../domain/user/service/identity-service";
import { UserService } from "../domain/user/service/user-service";

export type ApiServicesInput = {
  logger?: Logger;
  user?: UserService;
  identity?: IdentityService;
  image?: ImageService;
  poll?: PollService;
  pollOption?: PollOptionService;
  pollOptionVote: PollOptionVoteService;
};

export type ApiUserData = Pick<DomainContext, "language" | "isAuthenticated">;

export type ApiContextInput = ApiUserData & { services?: ApiServicesInput };
