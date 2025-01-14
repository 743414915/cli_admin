const mysql = require("mysql2/promise");
const { program } = require("commander");
const { getSqlType } = require("../utils/sql-type-map");

/**
 * @description 连接数据库
 *
 * @returns
 */
async function connMysql(options) {
  return mysql.createConnection({
    host: options.host,
    user: options.user,
    password: options.password,
    database: options.database,
  });
}

/**
 * @description 获取数据库中所有字段的信息
 *
 * @param conn
 * @param excludeFileds 不包含的字段，默认["created_at", "updated_at"]
 * @returns
 */
async function getMysqlFileds(
  conn,
  excludeFileds = ["created_at", "updated_at"]
) {
  const tableName = program.opts().table;
  const mysqlFileds = [];
  // 获取表的字段详细信息
  const result = await conn.query(`SHOW FULL COLUMNS FROM ${tableName}`);
  // console.log(result);
  for (const key in result[0]) {
    const fileInfo = result[0][key];
    if (excludeFileds.includes(fileInfo.Field)) {
      continue;
    }
    let type = "normal";
    if (["datetime", "date", "timestamp"].includes(fileInfo.Type)) {
      type = "timer";
    }
    const mysqlFiled = {
      prop: fileInfo.Field,
      type,
      label: fileInfo.Comment,
      columnDefault: fileInfo.Default,
      stringMaxLen: 0,
      valid: "",
      ts: getSqlType(fileInfo.Type, "mysql"),
      typeEnum: false,
    };
    mysqlFileds.push(mysqlFiled);
  }
  return mysqlFileds;
}

module.exports = { connMysql, getMysqlFileds };
