const { program } = require("commander");
const compileEjs = require("../../utils/compile-ejs");
const { writeFile, existsSync, mkdirSync } = require("../../utils/write-file");

/**
 *
 * @param {*} fileds 字段信息
 * @param {*} partName 部分名称
 * @param {*} enum_connect 接口连接
 */
async function createRoute({ fileds, partName, enum_connect, router_path }) {
  const snakeFileName = partName.replaceAll("-", "_");
  const result = await compileEjs("part/router.ts.ejs", {
    fileds,
    capitalSnakeFileName: partName.replaceAll("-", "_").toUpperCase(),
    snakeFileName,
    fileName: partName.replaceAll("-", "_"),
    router_path,
    routerPathFile: `layout/${router_path.replaceAll(
      "-",
      "_"
    )}/${snakeFileName}/${snakeFileName}.vue`,
  });
  // 2.将result写入到对应的文件夹中
  const dest =
    `${program.opts().dest}/router_path` ??
    `src/router/layout/${router_path.replaceAll("-", "_")}/${snakeFileName}`;
  if (!existsSync()) {
    mkdirSync(dest);
  }
  await writeFile(`${dest}/${snakeFileName}.ts`, result);
  console.log("创建组件成功", `route/${snakeFileName}.ts`);
}

module.exports = {
  createRoute,
};
