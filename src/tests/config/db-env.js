const NodeEnvironment = require("jest-environment-node");
const pg = require("pg");
const Redis = require("ioredis");
const Knex = require("knex");

// Parse bigint values from Postgres to Int
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => parseInt(value, 10));
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => parseFloat(value));

require("dotenv").config();

class DbTestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    this.global.redisInstance = new Redis(process.env.REDISCLOUD_URL);
    this.global.knexInstance = Knex({
      client: "pg",
      connection: process.env.DATABASE_URL,
    });
  }

  async teardown() {
    if (this.global.redisInstance) await this.global.redisInstance.quit();
    if (this.global.knexInstance) await this.global.knexInstance.destroy();

    await super.teardown();
  }
}

module.exports = DbTestEnvironment;
