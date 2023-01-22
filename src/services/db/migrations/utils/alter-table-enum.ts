// https://github.com/knex/knex/issues/1699#issuecomment-402603481
// Knex is using constraints for ENUM check and is unable to modify these by regular alter provided by library.

export type Options = {
  defaultValue?: string;
  oldConstraintName?: string;
};

export default (
  tableName: string,
  columnName: string,
  enums: string[],
  options?: Options
) => {
  const constraintName = `"${tableName}_${columnName}_check"`;
  const oldConstraint =
    options?.oldConstraintName || `"${tableName}_${columnName}_check"`;

  const rawSQL = [
    `ALTER TABLE "${tableName}" DROP CONSTRAINT IF EXISTS ${oldConstraint};`,
    `ALTER TABLE "${tableName}" ADD CONSTRAINT ${constraintName} CHECK ("${columnName}" = ANY (ARRAY['${enums.join(
      "'::text, '"
    )}'::text]));`,
  ];

  // Add defaultTo() functionality
  if (options?.defaultValue) {
    rawSQL.push(
      `ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" SET DEFAULT '${options.defaultValue}';`
    );
  }

  return rawSQL.join("\n");
};
