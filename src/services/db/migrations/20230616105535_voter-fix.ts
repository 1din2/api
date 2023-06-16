import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTable("Voter");

  await knex.schema.createTable("Voter", (table) => {
    table.string("id", 40).primary();
    table.string("uid", 40).notNullable().unique();
    table.string("ip", 40).notNullable();
    table.string("userId", 40).nullable();

    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));
  });

  await knex.raw(`DELETE FROM "PollOptionVote"`);

  await knex.schema.alterTable("PollOptionVote", (table) => {
    table.string("voterId", 40).alter();
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(): Promise<void> {}
