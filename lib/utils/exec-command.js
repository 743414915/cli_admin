const { spawn } = require('child_process')

function execCommand(...args) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    // 建立一个子进程childProcess执行命令
    const childProcess = spawn(...args)

    // @ts-ignore
    // 将childProcess的内容建立一条管道放入process.stdout中
    childProcess.stdout.pipe(process.stdout)

    // @ts-ignore
    // 将childProcess的错误信息建立一条管道放入process.stdout中
    childProcess.stderr.pipe(process.stderr)

    // 监听子进程执行结束，关闭
    // @ts-ignore
    childProcess.on('close', () => {
      resolve(void 0)
    })
  })
}
module.exports = execCommand