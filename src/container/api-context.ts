/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { ApiServices, getApiServices } from "./services";
import { ApiContextInput, ApiUserData } from "./types";
import { getRedisInstance } from "../services/db/redis";
import { dbInstance } from "../services/db/db";
import RedisCacheStorage from "../services/db/redis-cache-storage";
import { CacheStorage } from "../domain/base/cache-storage";
import getHeadersData from "./helpers/get-headers-data";
import { AuthDomainContext } from "../domain/user/usecase/auth-usercase";
import getCurrentUser from "./helpers/get-current-user";

export interface ApiContext extends AuthDomainContext {
  services: ApiServices;
  // usecases: ApiUsecases;
  end: () => Promise<void>;
}

const getDataFromInput = (input: ApiContextInput): ApiUserData => {
  const { language, isAuthenticated } = input;

  return {
    language,
    isAuthenticated,
  };
};

export async function createApiContext(req: Request): Promise<ApiContext>;
export async function createApiContext(
  input: ApiContextInput
): Promise<ApiContext>;
export async function createApiContext(): Promise<ApiContext>;

export async function createApiContext(
  input?: Request | ApiContextInput
): Promise<ApiContext> {
  const redis = getRedisInstance();
  const cacheStorage: CacheStorage = new RedisCacheStorage(redis);

  const req = (input as Request)?.headers ? (input as Request) : undefined;
  const inputData = input && !req ? (input as ApiContextInput) : undefined;

  const services = getApiServices(cacheStorage, inputData?.services);
  const logger = services.logger;
  const currentUser = req ? await getCurrentUser(req, services.user) : null;

  const data = req
    ? getHeadersData(req)
    : inputData
    ? getDataFromInput(inputData)
    : {
        language: "en",
        isAuthenticated: false,
      };

  const context: ApiContext = {
    ...data,
    services,
    logger,
    end: async () => {
      await redis.quit();
      await dbInstance().destroy();
    },
    currentUser: currentUser as never,
  };

  return context;
}
