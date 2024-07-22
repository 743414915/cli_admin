const { program } = require("commander");
const compileEjs = require("../../utils/compile-ejs");
const { writeFile, existsSync, mkdirSync } = require("../../utils/write-file");

/**
 *
 * @param {*} fileds 字段信息
 * @param {*} partName 部分名称
 * @param {*} enum_connect 接口连接
 */
async function createEnum({ fileds, partName, enum_connect, router_path }) {
  const result = await compileEjs("part/enum.ts.ejs", {
    capitalSnakeFileName: partName.replaceAll("-", "_").toUpperCase(),
    enum_connect,
  });

  // 2.将result写入到对应的文件夹中
  const dest =
    program.opts().dest ??
    `src/enums/url-enums/${router_path.replaceAll("-", "_")}`;
  if (!existsSync()) {
    mkdirSync(dest);
  }
  await writeFile(`${dest}/${partName}.ts`, result);
  console.log("创建组件成功", `enum/${partName}.ts`);
}

module.exports = {
  createEnum,
};
