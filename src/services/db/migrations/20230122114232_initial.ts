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
    table.string("uid").notNullable().unique();
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

  await knex.schema.createTable("Image", (table) => {
    table.increments("id").notNullable().primary();
    table.enu("provider", ["S3"]).notNullable();
    table.enu("type", ["SELECT"]).notNullable();
    table.string("contentType").notNullable();
    table.string("hash").notNullable();
    table.string("color");
    table.string("originalName");
    table.integer("length");
    table.integer("height").notNullable();
    table.integer("width").notNullable();
    table.string("content");
    table.string("url");
    table.integer("userId").index().references("User.id");
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt");

    table.unique(["hash", "height", "width"]);
  });

  await knex.schema.createTable("Poll", (table) => {
    table.increments("id").notNullable().primary();
    table.enu("status", ["DRAFT", "ACTIVE", "INACTIVE", "ENDED"]).notNullable();
    table.enu("type", ["SELECT"]).notNullable();
    table.string("title").notNullable();
    table.string("description");
    table.string("language", 2).notNullable();
    table.string("country", 2).notNullable();
    table.integer("minSelect").notNullable();
    table.integer("maxSelect").notNullable();
    table.dateTime("endsAt").notNullable().index();
    table.integer("userId").notNullable().references("User.id");
    table.integer("imageId").references("Image.id").onDelete("SET NULL");
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt");

    table.index(["country", "language"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("User");
  await knex.schema.dropTable("Identity");
  await knex.schema.dropTable("Image");
  await knex.schema.dropTable("Poll");
}
