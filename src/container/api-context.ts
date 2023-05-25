/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ApiServices, getApiServices } from "./services";
import { ApiContextInput, ApiUserData } from "./types";
import { getRedisInstance } from "../services/db/redis";
import { dbInstance } from "../services/db/db";
import RedisCacheStorage from "../services/db/redis-cache-storage";
import { CacheStorage } from "../domain/base/cache-storage";
import getHeadersData from "./helpers/get-headers-data";
import { AuthDomainContext } from "../domain/user/usecase/auth-usercase";
import getCurrentUser from "./helpers/get-current-user";
import { ApiUsecases, getApiUsecases } from "./usecases";

export interface ApiContext extends AuthDomainContext {
  services: ApiServices;
  usecases: ApiUsecases;
  end: () => Promise<void>;
}

const getDataFromInput = (input: ApiContextInput): ApiUserData => {
  const { language, isAuthenticated, project, ip } = input;

  return {
    language,
    isAuthenticated,
    project,
    ip,
  };
};

export async function createApiContext(input: {
  req: Request;
  res: Response;
}): Promise<ApiContext>;
export async function createApiContext(
  input: ApiContextInput
): Promise<ApiContext>;
export async function createApiContext(): Promise<ApiContext>;

export async function createApiContext(
  input?: { req: Request; res: Response } | ApiContextInput
): Promise<ApiContext> {
  const redis = getRedisInstance();
  const cacheStorage: CacheStorage = new RedisCacheStorage(redis);

  const req = ((input as any)?.req as Request) || undefined;
  const res = ((input as any)?.res as Response) || undefined;
  const inputData = input && !req ? (input as ApiContextInput) : undefined;

  const services = getApiServices(cacheStorage, inputData?.services);
  const logger = services.logger;
  const currentUser = req ? await getCurrentUser(req, services.user) : null;

  const data = req
    ? getHeadersData(req, res)
    : inputData
    ? getDataFromInput(inputData)
    : {
        language: "en",
        isAuthenticated: false,
        ip: "",
      };

  // if (!data.project) throw new Error("Project header is invalid");

  const usecases = getApiUsecases(services);

  const context: ApiContext = {
    ...data,
    services,
    usecases,
    logger,
    end: async () => {
      await redis.quit();
      await dbInstance().destroy();
    },
    currentUser: currentUser as never,
  };

  return context;
}
