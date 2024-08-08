const { program } = require("commander");
const { version } = require("../../package.json");

function helpOptions() {
  // 1.处理--version的操作
  program.version(version, "-v --version");

  // 2.增强其他的option的操作
  program
    .option("-t --test", "a cli test~")
    .option("-d --dest <dest>", "输出目标的文件夹，eg：-d src/components")
    .option("--table <table>", "连接的目标数据库表明，eg：--table table_name")
    .option(
      "--enum_connect <enum_connect>",
      "接口中间连接的部分，eg：--enum_connect team/switch/scheduling"
    )
    .option(
      "--router_path <router_path>",
      "页面文件的上一层文件夹名称，eg：--router_path lead-class"
    )
    .option(
      "--sql_type <sql_type>",
      "连接的数据库类型，默认是MySQL，eg：--sql_type postgre"
    );
}

module.exports = helpOptions;
