import Knex from "knex";

export default async (knex: Knex, tableName: string, stringField: string) => {
  const tempField = `${stringField}Temp`;
  await knex.schema.alterTable(tableName, table => {
    table.jsonb(tempField);
  });
  await knex.raw(
    `UPDATE "${tableName}" set "${tempField}" = ('["' || "${stringField}" || '"]')::jsonb where "${stringField}" is not null;`
  );
  await knex.schema.alterTable(tableName, table => {
    table.dropColumn(stringField);
    table.renameColumn(tempField, stringField);
  });
};
