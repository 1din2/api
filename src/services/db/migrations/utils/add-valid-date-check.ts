import Knex from "knex";

export default async (
  knex: Knex,
  table: string,
  columns: string | string[],
  minDate: "1500-01-01"
) => {
  const fields: string[] = typeof columns === "string" ? [columns] : columns;
  for (const field of fields) {
    const info = await knex(table).columnInfo(field);
    if (info.nullable)
      await knex.raw(
        `ALTER TABLE "${table}"	ADD CONSTRAINT ${table.toLowerCase()}_null_min_${field.toLowerCase()}_check
    			CHECK ("${field}" IS NULL OR "${field}" >= '${minDate}');`
      );
    else
      await knex.raw(
        `ALTER TABLE "${table}"	ADD CONSTRAINT ${table.toLowerCase()}_min_${field.toLowerCase()}_check
    			CHECK ("${field}" >= '${minDate}');`
      );
  }
};
