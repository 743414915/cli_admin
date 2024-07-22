const fs = require('fs')


function writeFile(path, content) {
  return fs.promises.writeFile(path, content)
}

function existsSync(path) {
  return fs.existsSync(path)
}

function mkdirSync(path) {
  return fs.mkdirSync(path, { recursive: true })
}


module.exports = { writeFile, existsSync, mkdirSync }