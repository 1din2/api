import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await knex.schema.createTable("User", (table) => {
    table.increments("id").notNullable().primary();
    table
      .integer("identityId")
      .notNullable()
      .unique()
      .references("Identity.id");

    table.string("displayName").notNullable();
    table.string("familyName");
    table.string("givenName");
    table.enu("role", ["USER", "ADMIN"]).notNullable();
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt");
  });

  await knex.schema.createTable("Identity", (table) => {
    table.increments("id").notNullable().primary();
    table.enu("provider", ["FACEBOOK", "GOOGLE"]).notNullable();
    table.string("providerId").notNullable();
    table.string("displayName").notNullable();
    table.string("familyName");
    table.string("givenName");
    table.specificType("emails", "varchar[]");
    table.specificType("photos", "varchar[]");
    table.jsonb("profile");
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt");

    table.unique(["provider", "providerId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("User");
  await knex.schema.dropTable("Identity");
}
