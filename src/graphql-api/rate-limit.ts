import rateLimit from "express-rate-limit";
import { Application } from "express";
import configuration from "../container/configuration";
import logger from "../domain/logger";

const limiter = rateLimit({
  windowMs: configuration.api_rate_limit_window_minutes * 60 * 1000, // X minutes
  max: configuration.api_rate_limit, // limit each IP to Y requests per windowMs
  onLimitReached: req =>
    logger.error(`Rate limit reached`, {
      ip: req.ip,
      ips: req.ips,
      headers: req.headers,
      url: req.url,
    }),
});

export default (app: Application) => {
  if (configuration.isDevelopment || configuration.isTest || configuration.ci)
    return;

  app.set("trust proxy", 1);

  app.use(limiter);
};
