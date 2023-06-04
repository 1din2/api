import { types } from "pg";
import Knex from "knex";
import configuration from "../../container/configuration";

const parseDate = (value: string) => {
  return !value ? null : new Date(value).toISOString();
};

// Parse bigint values from Postgres to Int
types.setTypeParser(types.builtins.INT8, (value) => parseInt(value, 10));
types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value));
types.setTypeParser(types.builtins.DATE, parseDate);
types.setTypeParser(types.builtins.TIMESTAMP, parseDate);
types.setTypeParser(types.builtins.TIMESTAMPTZ, parseDate);

let instance: Knex;

export const dbInstance = (newInstance?: Knex) => {
  if (newInstance) instance = newInstance;
  if (!instance)
    instance = Knex({
      client: "pg",
      connection: {
        connectionString: configuration.database_url,
        ssl: (process.env.PGSSLMODE && { rejectUnauthorized: false }) || false,
      },
      debug: false,
    });

  return instance;
};
