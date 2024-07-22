#!/usr/bin/env node
const { program } = require("commander");
const helpOptions = require("./core/help-option");
const {
  createProjectAction,
  createComponentsAction,
  createPartAction,
  createDialogAction
} = require("./core/actions");
const { create } = require("domain");

// 1.配置所有的options
helpOptions();

// 2.增加具体的功能操作
program
  .command("create <projectName> [others...]")
  .description("创建项目，eg：cli_admin create test")
  .action(createProjectAction);

program
  .command("addcpn <cpnName> [others...]")
  .description("创建组件，eg：cli_admin addcpn NavBar -d src/components")
  .action(createComponentsAction);

program
  .command("createPart <partName> [others...]")
  .description(
    "创建页面以及一系列相关文件，eg：cli_admin createPart team-switch-scheduling --table 3dm_team_switch_scheduling --enum_connect team/switch/scheduling --router_path lead-class"
  )
  .action(createPartAction);

program
  .command("createDialog <partName> [others...]")
  .description(
    "创建页面弹窗，eg：cli_admin createDialog test-dialog 这里是弹窗的标题"
  )
  .action(createDialogAction);

program.parse();
