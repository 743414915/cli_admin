const { program } = require("commander");
const compileEjs = require("../../utils/compile-ejs");
const { writeFile, existsSync, mkdirSync } = require("../../utils/write-file");

/**
 *
 * @param {*} fileds 字段信息
 * @param {*} partName 部分名称
 * @param {*} enum_connect 接口连接
 */
async function createObjEnum({ fileds, partName, enum_connect, router_path }) {
  const typeName =
    "I" +
    partName
      .split("-")
      .map((item) => item[0].toUpperCase() + item.substring(1, item.length))
      .join("");

  const typeEnum = [];
  fileds.forEach(({ prop, label }) => {
    if (!label) {
      return "";
    }
    // 提取键值对
    const match = label.match(/(\d+)\/[^;]+/g);
    if (!match) return ""; // 如果没有匹配的值，返回空字符串

    const unionTypes = match
      .map((item) => item.split("/")[0]) // 提取数字部分
      .join(" | "); // 用 " | " 连接

    fileds.find((item) => item.prop === prop).ts = `${typeName}_${prop}`;
    // 生成类型声明
    // `/** ${label} */\nexport type ${typeName}_${prop} = ${unionTypes};`
    typeEnum.push({
      comment: label,
      prop,
      upperCaseProp: prop.toUpperCase(),
      value: unionTypes,
      typeEnumName: `${typeName}_${prop}`,
      firstUpperCaseProp:
        prop[0].toUpperCase() + prop.substring(1, prop.length),
      typeEnumArr: match.map((item) => ({
        key: item.split("/")[0],
        value: item.split("/")[1],
      })),
    });
  });

  const result = await compileEjs("part/obj-enum.ts.ejs", {
    capitalSnakeFileName: partName.replaceAll("-", "_").toUpperCase(),
    enum_connect,
    typeEnum,
  });

  // 2.将result写入到对应的文件夹中
  const dest =
    `${program.opts().dest}/obj-enums` ??
    `src/enums/obj-enums/${router_path}`;
  if (!existsSync()) {
    mkdirSync(dest);
  }
  await writeFile(`${dest}/${partName}.ts`, result);
  console.log("创建组件成功", `obj-enum/${partName}.ts`);
}

module.exports = {
  createObjEnum,
};
