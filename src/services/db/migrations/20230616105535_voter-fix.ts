import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTable("PollOptionVote");
  await knex.schema.dropTable("Voter");

  await knex.schema.alterTable("Voter", (table) => {
    table.string("id", 40).primary();
    table.string("uid", 40).notNullable().unique();
    table.string("ip", 40).notNullable();
    table.string("userId", 40).nullable();

    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));
  });

  await knex.schema.createTable("PollOptionVote", (table) => {
    table.string("id", 40).notNullable().primary();
    table
      .string("voterId", 40)
      .notNullable()
      .references("Voter.id")
      .index()
      .onDelete("CASCADE");
    table
      .string("pollId", 40)
      .notNullable()
      .references("Poll.id")
      .index()
      .onDelete("CASCADE");
    table
      .string("pollOptionId", 40)
      .notNullable()
      .references("PollOption.id")
      .onDelete("CASCADE");
    table.string("ip", 40).notNullable();
    table.dateTime("createdAt").notNullable().defaultTo(knex.raw("NOW()"));
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("NOW()"));

    table.unique(["voterId", "pollOptionId"]);
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(): Promise<void> {}
