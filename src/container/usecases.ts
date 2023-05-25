import { VotePollUseCase } from "../domain/poll/usecase/vote-poll-usecase";
import { ProviderLoginUseCase } from "../domain/user/usecase/provider-login-usecase";
import { ApiServices } from "./services";

export interface ApiUsecases {
  providerLogin: ProviderLoginUseCase;
  votePoll: VotePollUseCase;
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

  const usecases: ApiUsecases = {
    providerLogin,
    votePoll,
  };

  return usecases;
};

export const getApiUsecases = (services: ApiServices) => {
  if (instance) return instance;

  instance = create(services);

  return instance;
};
