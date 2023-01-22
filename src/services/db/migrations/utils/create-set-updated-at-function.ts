import Knex from "knex";

export default (knex: Knex) =>
  knex.raw(`CREATE OR REPLACE FUNCTION set_updatedAt() RETURNS trigger AS
$set_updatedAt$
BEGIN
	NEW."updatedAt" := NOW();
	RETURN NEW;
END;
$set_updatedAt$ LANGUAGE plpgsql;`);
