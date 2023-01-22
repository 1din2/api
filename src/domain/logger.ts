import { Logger } from "./base/logger";
import { ConsoleLogger } from "./service/console-logger";

let logger = ConsoleLogger.Instance;

export const setLogger = (instance: Logger) => (logger = instance);

const wrapper: Logger = {
  info(...args: unknown[]): void {
    logger.info(...args);
  },

  warn(...args: unknown[]): void {
    logger.warn(...args);
  },

  error(...args: unknown[]): void {
    logger.error(...args);
  },

  debug(...args: unknown[]): void {
    logger.debug(...args);
  },

  event(message: string, data?: Record<string, unknown>): void {
    logger.event(message, data);
  },
};

export default wrapper;
