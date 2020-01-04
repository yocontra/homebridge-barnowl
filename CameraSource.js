const getImage = require('./get-image')

module.exports = Camera

function Camera (hap, conf, log) {
  this.hap = hap
  this.conf = conf
  this.log = log
  this.services = []
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

Camera.prototype.createCameraControlService = function () {
  const controlService = new this.hap.Service.CameraControl()
  this.services.push(controlService)
}
