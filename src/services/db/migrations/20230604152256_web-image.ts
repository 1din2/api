import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("WebImage", (table) => {
    table.string("id").primary();
    table.string("url").notNullable();
    table.integer("width").notNullable();
    table.integer("height").notNullable();
    table.string("hostname").notNullable();
    table.string("urlHash").notNullable().index();
    table
      .string("pollId")
      .nullable()
      .index()
      .references("id")
      .inTable("Poll")
      .onDelete("SET NULL");
    table
      .string("pollOptionId")
      .nullable()
      .index()
      .references("id")
      .inTable("PollOption")
      .onDelete("SET NULL");
    table.string("query").nullable();

    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("WebImage");
}
