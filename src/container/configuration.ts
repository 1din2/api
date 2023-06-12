/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

export interface Configuration {
  jwt_secret: string;
  port: number;
  host: string;
  database_url: string;
  ci: boolean;
  env_config_test: string;
  env_not_included_config_test: string;
  default_config_test: string;
  local_config_test: string;
  environment_config_test: string;
  rediscloud_url: string;
  api_token: string;

  environment: string;
  isProduction: boolean;
  isStaging: boolean;
  isDevelopment: boolean;
  isTest: boolean;
  isLocal: boolean;

  api_rate_limit_window_minutes: number;
  api_rate_limit: number;

  aws_access_key_id: string;
  aws_secret_access_key: string;
  aws_image_s3_buchet: string;
  aws_image_s3_region?: string;

  admin_email?: string;

  elasticsearch_url: string;
  projects: string[];
  root_path: string;
  facebook_app_id: string;
  facebook_app_secret: string;

  google_client_id: string;
  google_client_secret: string;
}

let configuration: Configuration;

const envsToInclude: (keyof Configuration)[] = [
  "api_token",
  "port",
  "ci",
  "database_url",
  "env_config_test",
  "rediscloud_url",
  "jwt_secret",
  "api_rate_limit_window_minutes",
  "api_rate_limit",

  "admin_email",

  "aws_access_key_id",
  "aws_secret_access_key",
  "aws_image_s3_buchet",
  "aws_image_s3_region",

  "elasticsearch_url",
  "projects",
  "root_path",
  "facebook_app_id",
  "facebook_app_secret",
  "google_client_id",
  "google_client_secret",
];

function readJson(readPath: string) {
  try {
    const data = readFileSync(readPath, "utf8");
    return JSON.parse(data);
  } catch (error: any) {
    if (
      error.code !== "ENOENT" ||
      (error.errno !== -4058 && error.errno !== -2)
    ) {
      throw error;
    }
  }
  return {};
}

function read(file: string): Configuration {
  const filePath = path.resolve(
    __dirname,
    "..",
    "..",
    "config",
    `${file}.json`
  );
  return readJson(filePath);
}

function assignEnv(config: Configuration): Configuration {
  const newConfig: Configuration = config;
  envsToInclude.forEach((key) => {
    const lc = key.toLowerCase() as keyof Configuration;
    const uc = key.toUpperCase();
    (newConfig[lc] as unknown) = process.env[uc] ?? config[lc];
  });
  return newConfig;
}

function loadEnvironmentSpecific(config: Configuration, environment: string) {
  let newConfig = config;
  if (environment) {
    const conf = read(environment);
    if (conf) {
      newConfig = {
        ...newConfig,
        ...conf,
      };
    }
  }
  return newConfig;
}

const ensureInteger = (
  fields: (keyof Configuration)[],
  config: Configuration
) =>
  fields.forEach((field) => {
    const value = config[field];
    if (typeof value === "string") {
      config[field] = parseInt(value, 10) as never;
    }
  });

function load() {
  const nodeEnv = process.env.NODE_ENV || "";

  // load default config
  let config = read("default");

  // load local config
  config = loadEnvironmentSpecific(config, "local");

  // load environment specific config
  config = loadEnvironmentSpecific(config, nodeEnv);

  // load config from env variables
  config = assignEnv(config);

  config.environment = nodeEnv || "local";
  config.isProduction = nodeEnv === "production";
  config.isStaging = nodeEnv === "staging";
  config.isDevelopment = nodeEnv === "development";
  config.isTest = nodeEnv === "test";
  config.isLocal = !nodeEnv;

  config.ci = !!(config.ci || process.env.CIRCLECI);

  const intFields: (keyof Configuration)[] = [];
  ensureInteger(intFields, config);

  config.projects =
    typeof config.projects === "string"
      ? (config.projects as string).split(/[,;]/g)
      : [];

  return config;
}

export function get() {
  if (!configuration) {
    configuration = load();
  }
  return configuration;
}

configuration = load();

export default configuration;
