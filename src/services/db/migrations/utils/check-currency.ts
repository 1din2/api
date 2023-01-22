export default (tableName: string, columnName: string, isRequired = false) => {
  const constraintName = `"${tableName}_${columnName}_check"`.toLowerCase();

  const logic = `"${columnName}"=upper("${columnName}") and length("${columnName}")=3 and length(trim("${columnName}"))=3`;

  const rawSQL = [
    `ALTER TABLE "${tableName}" DROP CONSTRAINT IF EXISTS ${constraintName};`,
    `ALTER TABLE "${tableName}" ADD CONSTRAINT ${constraintName}`,
  ];
  if (isRequired) rawSQL.push(`CHECK ("${columnName}" IS NULL OR (${logic});`);
  else rawSQL.push(`CHECK (${logic});`);

  return rawSQL.join("\n");
};
