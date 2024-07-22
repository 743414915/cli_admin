const { program } = require("commander");
const compileEjs = require("../../utils/compile-ejs");
const { writeFile, existsSync, mkdirSync } = require("../../utils/write-file");

/**
 *
 * @param {*} fileds 字段信息
 * @param {*} partName 部分名称
 * @param {*} enum_connect 接口连接
 */
async function createLess({ fileds, partName, enum_connect, router_path }) {
  const snakeFileName = partName.replaceAll("-", "_");
  const result = await compileEjs("part/less.ejs", {
    snakeFileName,
  });

  // 2.将result写入到对应的文件夹中
  const dest =
    program.opts().dest ??
    `src/views/layout/${router_path.replaceAll("-", "_")}/${snakeFileName}`;
  if (!existsSync()) {
    mkdirSync(dest);
  }
  await writeFile(`${dest}/${snakeFileName}.less`, result);
  console.log("创建组件成功", `${snakeFileName}.less`);
}

module.exports = {
  createLess,
};
