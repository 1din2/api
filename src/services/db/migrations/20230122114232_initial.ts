import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await knex.schema.createTable("User", (table) => {
    table.string("id").notNullable().primary();
    table.string("displayName").notNullable();
    table.string("uid").notNullable().unique();
    table.string("email");
    table.string("gender");
    table.string("familyName");
    table.string("givenName");
    table.enu("role", ["USER", "ADMIN"]).notNullable();
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));
  });

  await knex.schema.createTable("Account", (table) => {
    table.string("id").notNullable().primary();
    table.enu("provider", ["FACEBOOK", "GOOGLE"]).notNullable();
    table.string("providerId").notNullable();
    table.string("displayName").notNullable();
    table.string("familyName");
    table.string("givenName");
    table.specificType("emails", "varchar[]");
    table.specificType("photos", "varchar[]");
    table.jsonb("profile");
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));

    table.string("userId").notNullable().references("User.id");

    table.unique(["provider", "providerId"]);
  });

  await knex.schema.createTable("Image", (table) => {
    table.string("id").notNullable().primary();
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
    table.string("userId").index().references("User.id");
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));

    table.unique(["hash", "height", "width"]);
  });

  await knex.schema.createTable("Poll", (table) => {
    table.string("id").notNullable().primary();
    table.enu("status", ["DRAFT", "ACTIVE", "INACTIVE", "ENDED"]).notNullable();
    table.enu("type", ["SELECT"]).notNullable();
    table.string("title").notNullable();
    table.string("slug").notNullable();
    table.string("description");
    table.string("language", 2).notNullable();
    table.string("project", 10).notNullable();
    table.integer("minSelect").notNullable();
    table.integer("maxSelect").notNullable();
    table.dateTime("endsAt").notNullable().index();
    table.string("userId").notNullable().references("User.id");
    table.string("imageId").references("Image.id").onDelete("SET NULL");
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));

    table.index(["project", "language"]);
    table.index(["project", "language", "status", "createdAt"]);
    table.unique(["project", "slug"]);
  });

  await knex.schema.createTable("PollOption", (table) => {
    table.string("id").notNullable().primary();
    table.string("title").notNullable();
    table.string("description");
    table.integer("priority").notNullable();
    table.string("pollId").notNullable().references("Poll.id").index();
    table.string("imageId").references("Image.id").onDelete("SET NULL");
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));
  });

  await knex.schema.createTable("PollOptionVote", (table) => {
    table.string("id").notNullable().primary();
    table.string("userId").notNullable().references("User.id").index();
    table.string("pollId").notNullable().references("Poll.id").index();
    table.string("pollOptionId").notNullable().references("PollOption.id");
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));

    table.unique(["userId", "pollOptionId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("User");
  await knex.schema.dropTable("Account");
  await knex.schema.dropTable("Image");
  await knex.schema.dropTable("Poll");
  await knex.schema.dropTable("PollOption");
  await knex.schema.dropTable("PollOptionVote");
}
