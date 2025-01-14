const { program } = require("commander");
const compileEjs = require("../../utils/compile-ejs");
const { writeFile, existsSync, mkdirSync } = require("../../utils/write-file");

/**
 *
 * @param {*} fileds 字段信息
 * @param {*} partName 部分名称
 */
async function createType({ fileds, partName, router_path }) {
  const typeName =
    "I" +
    partName
      .split("-")
      .map((item) => item[0].toUpperCase() + item.substring(1, item.length))
      .join("");

  const typeEnum = [];
  fileds.forEach(({ prop, label }) => {
    // 提取键值对
    const match = label.match(/(\d+)\/[^;]+/g);
    if (!match) return ""; // 如果没有匹配的值，返回空字符串

    const unionTypes = match
      .map((item) => item.split("/")[0]) // 提取数字部分
      .join(" | "); // 用 " | " 连接

    fileds.find((item) => item.prop === prop).ts = `${typeName}_${prop}`;
    fileds.find((item) => item.prop === prop).typeEnum = true;
    // 生成类型声明
    // `/** ${label} */\nexport type ${typeName}_${prop} = ${unionTypes};`
    typeEnum.push({
      comment: label,
      key: `${typeName}_${prop}`,
      value: unionTypes,
    });
  });
  const result = await compileEjs("part/type.d.ts.ejs", {
    capitalSnakeFileName: partName.replaceAll("-", "_").toUpperCase(),
    typeName,
    fileds,
    typeEnum,
  });

  // 2.将result写入到对应的文件夹中
  const dest = program.opts().dest ?? `src/types/modules/${router_path}`;
  if (!existsSync()) {
    mkdirSync(dest);
  }
  await writeFile(`${dest}/${partName}.d.ts`, result);
  console.log("创建组件成功", `type/${partName}.d.ts`);
}

module.exports = {
  createType,
};
