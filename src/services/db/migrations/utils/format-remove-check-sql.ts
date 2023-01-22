export default (tableName: string, columnName: string) => {
  const constraintName = `"${tableName}_${columnName}_check"`;
  const tableNameModified = `"${tableName}"`;
  return `ALTER TABLE ${tableNameModified} DROP CONSTRAINT IF EXISTS ${constraintName};`;
};
