import Knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const config = {
  client: "pg",
  connection: process.env.DATABASE_URL || "",
};

function extractDatabaseName() {
  const databaseUrl = config.connection;
  const parts = databaseUrl.split("/");
  return parts[parts.length - 1];
}

async function main() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const knex = Knex(config);
  const database = extractDatabaseName();
  console.log(`Dropping database ${database}`);
  const tables = await knex
    .select("table_name")
    .table("information_schema.tables")
    .where({
      table_schema: "public",
      table_type: "BASE TABLE",
      table_catalog: database,
    })
    .then(rows => rows.map(row => row.table_name as string));

  if (tables.length > 0) {
    const args = tables.map(t => `"${t}"`).join(", ");
    await knex.raw(`DROP TABLE ${args} CASCADE`);

    const list = tables.join(", ");
    console.log(`Dropped ${list}`);
  } else {
    console.log("Database already empty");
  }
}

main()
  .then(() => process.exit())
  .catch(error => {
    console.error(error, error.stack);
    process.exit(1);
  });
