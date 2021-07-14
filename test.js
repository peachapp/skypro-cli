#! /usr/bin/env node
const inquirer = require("inquirer"); // 通过inquirier模块，我们可以在命令行中实现与用户的输入交互。
const Git = require("nodegit"); // 拉取github或者gitlab远程仓库代码的第三方模块
const process = require('child_process'); // 安装依赖包
const figlet = require('figlet'); // 艺术字
const program = require('commander');

// 模板对应的下载地址
const stores = [
  {
    name: "vite-vue",
    url: "https://github.com/peachapp/reading-vite-vue.git"
  },
  {
    name: "vue",
    url: "https://github.com/vuejs/vue.git"
  },
  {
    name: "react",
    url: "https://github.com/facebook/react.git"
  }
];

/** 克隆远程仓库代码 */
// url: 源码仓库地址; path: 要下载的目标路径; cb: 下载结束后的回调函数
const gitClone = (url, path, cb) => {
  console.log("正在下载远程仓库代码...");
  Git.Clone(url, path)
    .then(function (res) {
      console.log("远程仓库代码下载完成");
      cb(true)
    })
    .catch(function (err) {
      console.log("远程仓库代码下载失败：" + err);
      cb(false);
    });
};

/** 安装依赖包 */
// path是源码模板中package.json所在的路径
const install = (path) => {
  console.log("正在安装依赖包...");
  const cmd = 'cd ' + path + ' && yarn';
  process.exec(cmd, function (error, stdout, stderr) {
    console.log(error);
    console.log(stdout);
    console.log(stderr);
    console.log("依赖包安装完成");
  });
};

// 交互
const ask = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "项目名称",
      },
      {
        type: "list",
        name: "template",
        message: "请选择模板",
        choices: ["vite-vue", "vue", "react"],
      }
    ])
    .then((res) => {
      // res 用户输入/选择的内容
      const { name, template } = res;
      const selectedTemp = stores.find(item => item.name === template);
      gitClone(selectedTemp.url, name, (status) => {
        if (status) {
          install(name);
        };
      });
    });
};

// 入口函数
const init = () => {
  figlet('SKYPRO CLI!', { horizontalLayout: "full" }, function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    };
    console.log(data);
    ask();
  });
};

program.version('0.0.1')
  .option("-V, --version", "查看版本号信息")
  .option("-l, --list", "查看可用模版列表");

// 查看模板列表
if (program.opts() && program.opts().list) {
  console.log();
  stores.forEach((item, index) => {
    console.log("[" + (index + 1) + "] " + item.name)
  })
};

// 解析参数指令 skypro-cli、skypro-cli i、skypro-cli install
const ps = program.parse(process.argv);
if (ps?.args && ps.args[0]) {
  switch (ps.args[0]) {
    case "i":
    case "init":
      init();
      break;
    default:
      figlet('Halo', { horizontalLayout: "full" }, (err, data) => {
        console.log(data);
        console.warn("无效指令。");
      });
  };
} else {
  init();
};






