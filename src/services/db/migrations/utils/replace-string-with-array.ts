import Knex from "knex";

export default async (
  knex: Knex,
  tableName: string,
  existingField: string,
  newField: string
) => {
  if (existingField === newField)
    throw new Error(`Field names should be different!`);

  await knex.schema.alterTable(tableName, table => {
    table.jsonb(newField);
  });
  await knex.raw(
    `UPDATE "${tableName}" set "${newField}" = ('["' || "${existingField}" || '"]')::jsonb where "${existingField}" is not null;`
  );
  await knex.schema.alterTable(tableName, table => {
    table.dropColumn(existingField);
  });
};
