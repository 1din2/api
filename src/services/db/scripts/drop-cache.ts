import { getRedisInstance } from "../redis";

const instance = getRedisInstance();

instance
  .flushall()
  .then(() => console.info(`Redis db dropped`))
  .catch(console.error)
  .finally(() => instance.quit());
