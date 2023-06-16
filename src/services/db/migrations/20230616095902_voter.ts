import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("Voter", (table) => {
    table.string("id", 20).primary();
    table.string("uid", 20).notNullable().unique();
    table.string("ip", 20).notNullable();
    table.string("userId", 20).nullable();

    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));
  });

  await knex.raw(`DELETE FROM "PollOptionVote"`);

  await knex.schema.alterTable("PollOptionVote", (table) => {
    table.dropColumn("userId");
    table
      .string("voterId", 20)
      .notNullable()
      .references("Voter.id")
      .index()
      .onDelete("CASCADE");

    table.unique(["voterId", "pollOptionId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("Voter");
}
