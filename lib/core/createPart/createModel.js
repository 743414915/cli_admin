const { program } = require("commander");
const compileEjs = require("../../utils/compile-ejs");
const { writeFile, existsSync, mkdirSync } = require("../../utils/write-file");

/**
 *
 * @param {*} fileds 字段信息
 * @param {*} partName 部分名称
 * @param {*} enum_connect 接口连接
 */
async function createModel({ fileds, partName, enum_connect, router_path }) {
  const snakeFileName = partName.replaceAll("-", "_");
  const typeName =
    "I" +
    partName
      .split("-")
      .map((item) => item[0].toUpperCase() + item.substring(1, item.length))
      .join("");
  const result = await compileEjs("part/config/modal.config.ts.ejs", {
    fileds,
    capitalSnakeFileName: partName.replaceAll("-", "_").toUpperCase(),
    partName,
    typeName,
  });

  // 2.将result写入到对应的文件夹中
  const dest =
    program.opts().dest ??
    `src/views/layout/${router_path.replaceAll(
      "-",
      "_"
    )}/${snakeFileName}/config`;
  if (!existsSync()) {
    mkdirSync(dest);
  }
  await writeFile(`${dest}/modal.config.ts`, result);
  console.log("创建组件成功", `modal.config.ts`);
}

module.exports = {
  createModel,
};
