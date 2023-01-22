import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await knex.schema.createTable("User", (table) => {
    table.increments("id").notNullable().primary();
    table.string("uid").notNullable().unique();
    table.string("name").notNullable();
    table.string("firstName");
    table.string("lastName");
    table.enu("gender", ["MALE", "FEMALE"]);
    table.enu("role", ["USER", "ADMIN"]).notNullable();
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("User");
}
