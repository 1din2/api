import Knex from "knex";

export default (knex: Knex, columnName: string): Promise<string[]> =>
  knex
    .raw(
      `select t.table_name
from information_schema.tables t
inner join information_schema.columns c on c.table_name = t.table_name
and c.table_schema = t.table_schema
where c.column_name = ?
and t.table_schema not in ('information_schema', 'pg_catalog')
and t.table_type = 'BASE TABLE' and t.table_schema='public';`,
      [columnName]
    )
    .then(r => r.rows.map((it: { table_name: string }) => it.table_name));
