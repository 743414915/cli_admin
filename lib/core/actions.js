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
const { createEnum } = require("./createPart/createEnum");
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

/**
 * @description 创建页面以及一系列相关文件
 *
 * @param {string} partName 组件名称
 * @param {any} others 其他的参数
 */
async function createPartAction(partName, others) {
  // 获取数据库的字段信息
  let param = {};
  if (program.opts().sql_type == "postgre") {
    let fileds = [];
    if (program.opts().table) {
      const conn = await connPostgresSql(POSTGRES_CONFIG);
      fileds = await getPostgresSqlFileds(conn, partName);
    }
    param = {
      enum_connect: program.opts().enum_connect,
      router_path: program.opts().router_path,
      table: program.opts().table,
      partName,
      others,
      fileds,
    };
  } else {
    let fileds = [];
    if (program.opts().table) {
      const conn = await connMysql(MYSQL_CONFIG);
      fileds = await getMysqlFileds(conn, partName);
    }
    param = {
      enum_connect: program.opts().enum_connect,
      router_path: program.opts().router_path || "test",
      table: program.opts().table,
      partName,
      others,
      fileds,
    };
  }

  await createModel(param);
  await createContent(param);
  await createSearch(param);
  await createEnum(param);
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
