import "reflect-metadata";
import { dbInstance } from "../../services/db/db";
import { setRedisInstance } from "../../services/db/redis";

const redis = global.redisInstance;
if (redis) setRedisInstance(redis);

const db = global.knexInstance;
if (db) dbInstance(db);
