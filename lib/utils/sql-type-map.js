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
      bigint: "number", // Use string for bigint to avoid precision issues in JS
      "bigint unsigned": "string",
      decimal: "number", // Use string to preserve precision
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
      bigint: "number", // Use string for bigint to avoid precision issues in JS
      int8: "string",
      real: "number",
      float4: "number",
      double: "number",
      float8: "number",
      numeric: "number", // Use string to preserve precision
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

      // Full-text search types
      tsvector: "string", // Text search vector
      tsquery: "string", // Text search query

      // Range types
      int4range: "Array<number>", // Integer range
      int8range: "Array<string>", // Bigint range
      numrange: "Array<string>", // Numeric range
      tsrange: "Array<string>", // Timestamp range
      tstzrange: "Array<string>", // Timestamp with timezone range
      daterange: "Array<string>", // Date range

      // Hstore (key-value pairs)
      hstore: "object",

      // JSON-like types
      jsonpath: "object", // JSON path queries

      // Network address types
      macaddr8: "string", // MAC address (8-byte)
      inet: "string", // Network address (IPv4 or IPv6)
      cidr: "string", // IP network address

      // Geometric types
      point: "string", // Point (x, y)
      line: "string", // Line
      lseg: "string", // Line segment
      box: "string", // Box
      path: "string", // Path (closed or open)
      polygon: "string", // Polygon
      circle: "string", // Circle

      // Custom PostgreSQL types
      oid: "number", // Object Identifier (OID)
      uuid: "string", // Universally Unique Identifier (UUID)
      xml: "string", // XML data type
      bit: "string", // Fixed-length bit string
      varbit: "string", // Variable-length bit string
    },
  };

  // Normalize the input by removing parentheses and converting to lowercase
  const normalizedType = typeKey.split("(")[0].trim().toLowerCase();

  // Return the mapped TypeScript type or a default type if not found
  return typeMapping[dbType][normalizedType] || "unknown";
}
module.exports = { getSqlType };
