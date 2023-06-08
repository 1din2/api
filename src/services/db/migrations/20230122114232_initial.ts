import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await knex.schema.createTable("User", (table) => {
    table.string("id", 40).notNullable().primary();
    table.string("displayName").notNullable();
    table.string("uid").notNullable().unique();
    table.string("email", 50).unique();
    table.string("gender", 10);
    table.string("familyName");
    table.string("givenName");
    table.string("project", 50).notNullable();
    table.string("role", 10).notNullable();
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));
  });

  await knex.schema.createTable("Account", (table) => {
    table.string("id", 40).notNullable().primary();
    table.string("provider", 10).notNullable();
    table.string("providerId").notNullable();
    table.string("displayName").notNullable();
    table.string("familyName");
    table.string("givenName");
    table.specificType("emails", "varchar[]");
    table.specificType("photos", "varchar[]");
    table.jsonb("profile");
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));

    table.string("userId", 40).notNullable().references("User.id");

    table.unique(["provider", "providerId"]);
  });

  await knex.schema.createTable("Image", (table) => {
    table.string("id", 40).notNullable().primary();
    table.string("provider", 10).notNullable();
    table.string("contentType", 50).notNullable();
    table.string("hash", 40).notNullable();
    table.string("color", 6);
    table.string("originalName");
    table.integer("length");
    table.integer("height").notNullable();
    table.integer("width").notNullable();
    table.string("content");
    table.string("url");
    table.string("userId", 40).index().references("User.id");
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));

    table.unique(["hash", "height", "width"]);
  });

  await knex.schema.createTable("Poll", (table) => {
    table.string("id", 40).notNullable().primary();
    table.string("status", 10).notNullable();
    table.string("type", 10).notNullable();
    table.string("title").notNullable();
    table.string("slug").notNullable();
    table.string("description");
    table.string("language", 2).notNullable();
    table.string("project", 10).notNullable();
    table.integer("minSelect").notNullable();
    table.integer("maxSelect").notNullable();
    table.dateTime("endsAt").notNullable().index();
    table.string("userId", 40).notNullable().references("User.id");
    table.string("imageId", 40).references("Image.id").onDelete("SET NULL");
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));

    table.index(["project", "language"]);
    table.index(["project", "language", "status", "createdAt"]);
    table.unique(["project", "slug"]);
  });

  await knex.schema.createTable("PollOption", (table) => {
    table.string("id", 40).notNullable().primary();
    table.string("title").notNullable();
    table.string("description");
    table.integer("priority").notNullable();
    table.string("pollId", 40).notNullable().references("Poll.id").index();
    table.string("imageId", 40).nullable().references("Image.id");
    table.string("color", 6).nullable();
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));
  });

  await knex.schema.createTable("PollOptionVote", (table) => {
    table.string("id", 40).notNullable().primary();
    table.string("userId", 40).notNullable().references("User.id").index();
    table.string("pollId", 40).notNullable().references("Poll.id").index();
    table.string("pollOptionId", 40).notNullable().references("PollOption.id");
    table.string("ip", 40).notNullable();
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));

    table.unique(["userId", "pollOptionId"]);
  });

  await knex.schema.createTable("Tag", (table) => {
    table.string("id", 40).notNullable().primary();
    table.string("name", 50).notNullable();
    table.string("slug", 50).notNullable();
    table.string("description");
    table.string("language", 2).notNullable();
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));

    table.unique(["language", "slug"]);
  });

  await knex.schema.createTable("PollTag", (table) => {
    table.string("id", 40).notNullable().primary();
    table.string("pollId", 40).notNullable().references("Poll.id").index();
    table.string("tagId", 40).notNullable().references("Tag.id").index();
    table.string("pollOptionId", 40).references("PollOption.id").index();
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));

    table.unique(["pollId", "tagId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("User");
  await knex.schema.dropTable("Account");
  await knex.schema.dropTable("Image");
  await knex.schema.dropTable("Poll");
  await knex.schema.dropTable("PollOption");
  await knex.schema.dropTable("PollOptionVote");
  await knex.schema.dropTable("Tag");
  await knex.schema.dropTable("PollTag");
}
