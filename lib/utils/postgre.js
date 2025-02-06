const { Client } = require("pg");
const { program } = require("commander");
const { getSqlType } = require("../utils/sql-type-map");

/**
 * @description 连接postgresSql数据库
 *
 * @returns
 */
async function connPostgresSql(options) {
  const client = new Client({
    host: options.host,
    port: options.port,
    database: options.database,
    user: options.user,
    password: options.password,
  });
  await client.connect();
  return client;
}

/**
 * @description 获取数据库中所有字段的信息
 *
 * @param conn
 * @param tableName 数据库表名称
 * @param excludeFileds 不包含的字段，默认["created_at", "updated_at"]
 * @returns
 */
async function getPostgresSqlFileds(
  conn,
  tableName,
  excludeFileds = ["created_at", "updated_at"]
) {
  const postgreFileds = [];
  // 获取表的字段详细信息
  const query = `SELECT
          cols.COLUMN_NAME AS Field,
          COALESCE(
              type_map.typname,
              cols.data_type
          ) AS TYPE,
          cols.column_default AS DEFAULT,
          descr.description AS COMMENT
      FROM
          information_schema.COLUMNS AS cols
      LEFT JOIN pg_catalog.pg_description AS descr
          ON descr.objoid = (
              SELECT OID
              FROM pg_catalog.pg_class
              WHERE relname = $1
              AND relnamespace = (
                  SELECT OID
                  FROM pg_catalog.pg_namespace
                  WHERE nspname = 'public'
              )
          )
          AND descr.objsubid = cols.ordinal_position
      LEFT JOIN pg_catalog.pg_attribute AS attr
          ON attr.attrelid = (
              SELECT OID
              FROM pg_catalog.pg_class
              WHERE relname = $1
              AND relnamespace = (
                  SELECT OID
                  FROM pg_catalog.pg_namespace
                  WHERE nspname = 'public'
              )
          )
          AND attr.attname = cols.COLUMN_NAME
      LEFT JOIN pg_catalog.pg_type AS type_map
          ON type_map.oid = attr.atttypid
      WHERE
          cols.TABLE_NAME = $1
          AND cols.table_schema = 'public'
      ORDER BY
          cols.ordinal_position;`;
  const result = await conn.query(query, [tableName]);
  //   console.log(result.rows);
  for (const key in result.rows) {
    const fileInfo = result.rows[key];
    if (excludeFileds.includes(fileInfo.Field)) {
      continue;
    }
    let type = "normal";
    if (["datetime", "date", "timestamp"].includes(fileInfo.Type)) {
      type = "timer";
    }
    const postgreFiled = {
      prop: fileInfo.field,
      type,
      label: fileInfo.comment,
      columnDefault: fileInfo.default,
      stringMaxLen: 0,
      valid: "",
      ts: getSqlType(fileInfo.type, "postgresql"),
      typeEnum: false,
    };
    postgreFileds.push(postgreFiled);
  }
  return postgreFileds;
}

module.exports = { connPostgresSql, getPostgresSqlFileds };
