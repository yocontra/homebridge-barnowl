const fs = require('fs')

module.exports = async function (path) {
  return fs.readFileSync(path)
}
