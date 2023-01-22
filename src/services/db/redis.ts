import RedisClass, { Redis } from "ioredis";
import configuration from "../../container/configuration";

let redisInstance: Redis;

export const setRedisInstance = (redis: Redis) => {
  redisInstance = redis;
};

export const getRedisInstance = (): Redis => {
  if (!redisInstance) {
    redisInstance = new RedisClass(configuration.rediscloud_url);
  }

  return redisInstance;
};
