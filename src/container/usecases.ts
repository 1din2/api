import { ProviderLoginUseCase } from "../domain/user/usecase/provider-login-usecase";
import { ApiServices } from "./services";

export interface ApiUsecases {
  providerLogin: ProviderLoginUseCase;
}

let instance: ApiUsecases;

const create = (services: ApiServices) => {
  const providerLogin = new ProviderLoginUseCase(
    services.user,
    services.account
  );

  const usecases: ApiUsecases = {
    providerLogin,
  };

  return usecases;
};

export const getApiUsecases = (services: ApiServices) => {
  if (instance) return instance;

  instance = create(services);

  return instance;
};
