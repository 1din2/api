import * as util from "util";
import { Logger } from "../base/logger";

let logger: Logger | null = null;

export class ConsoleLogger implements Logger {
  static get Instance(): Logger {
    if (!logger) logger = new ConsoleLogger();
    return logger;
  }

  info(...args: unknown[]): void {
    console.log(...args);
  }

  warn(...args: unknown[]): void {
    console.warn(...args);
  }

  error(...args: unknown[]): void {
    // Prevent hiding of any stack traces
    const newArgs = args.map(x =>
      util.inspect(x, { showHidden: false, depth: null })
    );

    console.error(...newArgs);
  }

  debug(...args: unknown[]): void {
    console.debug(...args);
  }

  event(message: string, data?: Record<string, unknown>): void {
    this.warn(message, data);
  }
}
