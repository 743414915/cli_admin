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
 * @param excludeFileds 不包含的字段，默认["created_at", "updated_at"]
 * @returns
 */
async function getPostgresSqlFileds(
  conn,
  excludeFileds = ["created_at", "updated_at"]
) {
  const tableName = program.opts().table;
  const postgreFileds = [];
  // 获取表的字段详细信息

  const query = `SELECT 
  cols.column_name AS Field,
  cols.data_type AS Type,
  cols.column_default AS Default,
  descr.description AS Comment
FROM 
  information_schema.columns AS cols
LEFT JOIN 
  pg_catalog.pg_description AS descr 
ON 
  descr.objoid = (SELECT oid FROM pg_catalog.pg_class WHERE relname = $1 AND relnamespace = (SELECT oid FROM pg_catalog.pg_namespace WHERE nspname = 'public')) 
AND 
  descr.objsubid = cols.ordinal_position
WHERE 
  cols.table_name = $1 
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
      ts: getSqlType(fileInfo.Type, "postgresql"),
      typeEnum: false,
    };
    postgreFileds.push(postgreFiled);
  }
  return postgreFileds;
}

module.exports = { connPostgresSql, getPostgresSqlFileds };
