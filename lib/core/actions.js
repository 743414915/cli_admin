const { promisify } = require("util");
const downloadGitRepo = promisify(require("download-git-repo"));
const { VUE_REPO } = require("../config/repo");
const { MYSQL_CONFIG } = require("../config/mysql");
const execCommand = require("../utils/exec-command");
const compileEjs = require("../utils/compile-ejs");
const { connMysql, getMysqlFileds } = require("../utils/mysql");
const { writeFile, existsSync, mkdirSync } = require("../utils/write-file");
const { program } = require("commander");
const { createModel } = require("./createPart/createModel");
const { createContent } = require("./createPart/createContent");
const { createSearch } = require("./createPart/createSearch");
const { createUrlEnum } = require("./createPart/createUrlEnum");
const { createObjEnum } = require("./createPart/createObjEnum");
const { createType } = require("./createPart/createType");
const { createRoute } = require("./createPart/createRoute");
const { createLess } = require("./createPart/createLess");
const { createVue } = require("./createPart/createVue");
const { title } = require("process");
const { connPostgresSql, getPostgresSqlFileds } = require("../utils/postgre");
const { POSTGRES_CONFIG } = require("../config/postgre");

/**
 * @description 创建项目
 *
 * @param {string} projectName 项目名称
 * @param {any} others 其他的参数
 */
async function createProjectAction(projectName, others) {
  try {
    // 1.从GitHub下载模板
    await downloadGitRepo(VUE_REPO, projectName, { clone: true });

    // 2. 提示信息
    // console.log(`cd ${projectName}`)
    // console.log(`npm install`)
    // console.log(`npm run dev`)

    const commandName = process.platform === "win32" ? "npm.cmd" : "npm";

    // 3.帮助执行npm install
    await execCommand(commandName, ["install"], { cwd: `./${projectName}` });

    // 4.帮助执行npm run dev
    await execCommand(commandName, ["run", "dev"], { cwd: `./${projectName}` });
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description 创建组件
 *
 * @param {string} cpnName 组件名称
 * @param {any} others 其他的参数
 */
async function createComponentsAction(cpnName, others) {
  // 1.创建一个组件模板，根据内容给模板中填充数据
  const result = await compileEjs("component.vue.ejs", {
    name: cpnName,
    upperName: cpnName.toUpperCase(),
  });

  // 2.将result写入到对应的文件夹中
  const dest = program.opts().dest ?? "src/components";
  if (!existsSync()) {
    mkdirSync(dest);
  }
  await writeFile(`${dest}/${cpnName}.vue`, result);
  console.log("创建组件成功", `${cpnName}`);
}
// cli_admin createPart team-switch-scheduling --table 3dm_team_switch_scheduling
//  --enum_connect team/switch/scheduling --router_path lead-class
/**
 * @description 创建页面以及一系列相关文件
 *
 * @param {string} table 数据库表名称
 * @param {any} others 其他的参数
 */
async function createPartAction(table, others) {
  // const table =
  //   program.opts().table || "3dm_".concat(partName.split("-").join("_"));
  const partName = table.split("3dm_")[1].split("_").join("-");
  const enum_connect =
    program.opts().enum_connect || partName.split("-").join("/");
  // 获取数据库的字段信息
  let param = {};
  const { sql_host, sql_port, sql_database, sql_user, sql_password } =
    program.opts();
  if (program.opts().sql_type == "postgre") {
    let fileds = [];
    if (table) {
      const conn = await connPostgresSql({
        host: sql_host || POSTGRES_CONFIG.host,
        port: sql_port || POSTGRES_CONFIG.port,
        database: sql_database || POSTGRES_CONFIG.database,
        user: sql_user || POSTGRES_CONFIG.user,
        password: sql_password || POSTGRES_CONFIG.password,
      });
      fileds = await getPostgresSqlFileds(conn, table);
    }
    param = {
      enum_connect,
      router_path: program.opts().router_path || "test",
      table,
      partName,
      others,
      fileds,
    };
  } else {
    let fileds = [];
    if (table) {
      const conn = await connMysql({
        host: sql_host || MYSQL_CONFIG.host,
        port: sql_port || MYSQL_CONFIG.port,
        database: sql_database || MYSQL_CONFIG.database,
        user: sql_user || MYSQL_CONFIG.user,
        password: sql_password || MYSQL_CONFIG.password,
      });
      fileds = await getMysqlFileds(conn, table);
    }
    param = {
      enum_connect,
      router_path: program.opts().router_path || "test",
      table,
      partName,
      others,
      fileds,
    };
  }

  await createModel(param);
  await createContent(param);
  await createSearch(param);
  await createUrlEnum(param);
  await createObjEnum(param);
  await createType(param);
  await createRoute(param);
  await createLess(param);
  await createVue(param);
}

/**
 * @description 创建弹窗
 *
 * @param {string} dialogName 组件名称
 * @param {any} others 其他的参数
 */
async function createDialogAction(dialogName, others) {
  const result = await compileEjs("pageDialog.ejs", {
    dialogName,
    title: others?.[0] ?? "弹窗",
  });

  // 2.将result写入到对应的文件夹中
  const dest = program.opts().dest ?? `src`;
  if (!existsSync()) {
    mkdirSync(dest);
  }
  await writeFile(`${dest}/${dialogName}.vue`, result);
  console.log("创建组件成功", `${dialogName}.vue`);
}

module.exports = {
  createProjectAction,
  createComponentsAction,
  createPartAction,
  createDialogAction,
};
