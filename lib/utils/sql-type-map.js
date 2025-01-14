/**
 *
 * @param {string} typeKey 数据库的数据类型
 * @param {"mysql" | "postgresql"} dbType 数据库类型
 * @returns
 */
function getSqlType(typeKey, dbType) {
  const typeMapping = {
    mysql: {
      // String types
      char: "string",
      varchar: "string",
      tinytext: "string",
      text: "string",
      mediumtext: "string",
      longtext: "string",
      enum: "string",
      set: "string",

      // Numeric types
      bit: "number",
      tinyint: "number",
      "tinyint unsigned": "number",
      smallint: "number",
      "smallint unsigned": "number",
      mediumint: "number",
      "mediumint unsigned": "number",
      int: "number",
      "int unsigned": "number",
      bigint: "string", // Use string for bigint to avoid precision issues in JS
      "bigint unsigned": "string",
      decimal: "string", // Use string to preserve precision
      "decimal unsigned": "string",
      float: "number",
      "float unsigned": "number",
      double: "number",
      "double unsigned": "number",
      real: "number",
      "real unsigned": "number",

      // Date and time types
      date: "string",
      datetime: "string",
      timestamp: "string",
      time: "string",
      year: "number",

      // Binary types
      binary: "Buffer",
      varbinary: "Buffer",
      tinyblob: "Buffer",
      blob: "Buffer",
      mediumblob: "Buffer",
      longblob: "Buffer",

      // Spatial types
      geometry: "string", // Can be JSON in some configurations
      point: "string",
      linestring: "string",
      polygon: "string",
      multipoint: "string",
      multilinestring: "string",
      multipolygon: "string",
      geometrycollection: "string",
    },
    postgresql: {
      // Character types
      char: "string",
      varchar: "string",
      text: "string",

      // Numeric types
      smallint: "number",
      int2: "number",
      integer: "number",
      int4: "number",
      bigint: "string", // Use string for bigint to avoid precision issues in JS
      int8: "string",
      real: "number",
      float4: "number",
      double: "number",
      float8: "number",
      numeric: "string", // Use string to preserve precision
      decimal: "string",

      // Boolean type
      boolean: "boolean",
      bool: "boolean",

      // Date and time types
      date: "string",
      timestamp: "string",
      timestamptz: "string", // Timestamp with time zone
      time: "string",
      timetz: "string", // Time with time zone
      interval: "string",

      // JSON types
      json: "object",
      jsonb: "object",

      // UUID
      uuid: "string",

      // Arrays
      array: "Array<any>",

      // Other types
      bytea: "Buffer",
      serial: "number",
      bigserial: "string",
      money: "string",
      xml: "string",
      point: "string",
      line: "string",
      lseg: "string",
      box: "string",
      path: "string",
      polygon: "string",
      circle: "string",
      cidr: "string",
      inet: "string",
      macaddr: "string",
      macaddr8: "string",
    },
  };

  // Normalize the input by removing parentheses and converting to lowercase
  const normalizedType = typeKey.split("(")[0].trim().toLowerCase();

  // Return the mapped TypeScript type or a default type if not found
  return typeMapping[dbType][normalizedType] || "unknown";
}
module.exports = { getSqlType };
