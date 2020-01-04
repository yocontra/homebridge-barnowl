const getImage = require('./get-image')

module.exports = Camera

function Camera (hap, conf, log) {
  this.hap = hap
  this.conf = conf
  this.log = log
}

Camera.prototype.handleSnapshotRequest = function (request, callback) {
  const log = this.log

  return getImage(this.conf.path)
    .then(img => {
      log('Got image', img)
      callback(null, img)
    })
    .catch(reason => {
      log(reason)
      callback(reason)
    })
}
