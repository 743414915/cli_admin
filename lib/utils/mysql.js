const mysql = require("mysql2/promise");
const { program } = require("commander");

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
    switch (getMySqlType(fileInfo.Type)) {
      case "timer":
        type = "timer";
        break;

      default:
        break;
    }
    const mysqlFiled = {
      prop: fileInfo.Field,
      type,
      label: fileInfo.Comment,
      columnDefault: fileInfo.Default,
      stringMaxLen: 0,
      valid: "",
    };
    mysqlFileds.push(mysqlFiled);
  }
  return mysqlFileds;
}

/**
 * @description 数据库的类型在ts中对应的类型
 *
 * @param typeKey 数据库中的类型
 * @returns ts中的类型
 */
function getMySqlType(typeKey) {
  const typeObj = {
    char: "string",
    varchar: "string",
    tinytext: "string",
    longtext: "string",
    text: "string",

    bool: "boolean",
    int: "number",
    "int unsigned": "number",
    tinyint: "number",
    "tinyint unsigned": "number",
    smallint: "number",
    "smallint unsigned": "number",
    bigint: "number",
    "bigint unsigned": "number",
    float: "number",
    double: "number",
    decimal: "number",

    datetime: "timer",
    date: "timer",
    timestamp: "timer",
  };
  return typeObj[typeKey];
}

module.exports = { connMysql, getMysqlFileds };
