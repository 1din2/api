import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("Voter", (table) => {
    table.string("id", 40).alter();
    table.string("uid", 40).notNullable().alter();
    table.string("ip", 40).notNullable().alter();
    table.string("userId", 40).nullable().alter();
  });

  await knex.raw(`DELETE FROM "PollOptionVote"`);

  await knex.schema.alterTable("PollOptionVote", (table) => {
    table.string("voterId", 40).alter();
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(): Promise<void> {}
