import { CreatePollUseCase } from "../domain/poll/usecase/create-poll-usecase";
import { SavePollTagsUseCase } from "../domain/poll/usecase/save-poll-tags-usecase";
import { UpdatePollUseCase } from "../domain/poll/usecase/update-poll-usecase";
import { VotePollUseCase } from "../domain/poll/usecase/vote-poll-usecase";
import { ProviderLoginUseCase } from "../domain/user/usecase/provider-login-usecase";
import { ApiServices } from "./services";

export interface ApiUsecases {
  providerLogin: ProviderLoginUseCase;
  votePoll: VotePollUseCase;
  createPoll: CreatePollUseCase;
  updatePoll: UpdatePollUseCase;
  savePollTags: SavePollTagsUseCase;
}

let instance: ApiUsecases;

const create = (services: ApiServices) => {
  const providerLogin = new ProviderLoginUseCase(
    services.user,
    services.account
  );

  const votePoll = new VotePollUseCase(
    services.poll,
    services.pollOption,
    services.pollOptionVote
  );

  const savePollTags = new SavePollTagsUseCase(
    services.poll,
    services.tag,
    services.pollTag
  );

  const createPoll = new CreatePollUseCase(services.poll, savePollTags);
  const updatePoll = new UpdatePollUseCase(services.poll, savePollTags);

  const usecases: ApiUsecases = {
    providerLogin,
    votePoll,
    createPoll,
    updatePoll,
    savePollTags,
  };

  return usecases;
};

export const getApiUsecases = (services: ApiServices) => {
  if (instance) return instance;

  instance = create(services);

  return instance;
};
