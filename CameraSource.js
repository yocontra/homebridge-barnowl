const ip = require('ip')
const getImage = require('./get-image')

module.exports = CameraSource

function CameraSource (hap, conf, log) {
  this.hap = hap
  this.conf = conf
  this.log = log
  this.services = []
}

CameraSource.prototype.handleSnapshotRequest = function (request, callback) {
  const log = this.log
  log('CameraSource handleSnapshotRequest', this.conf)

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

CameraSource.prototype.createCameraControlService = function () {
  this.log('CameraSource createCameraControlService', this.conf)
  const controlService = new this.hap.Service.CameraControl()
  this.services.push(controlService)
}

CameraSource.prototype.handleStreamRequest = function (request) {
  this.log('CameraSource handleStreamRequest', this.conf)
}

CameraSource.prototype.prepareStream = function (request, callback) {
  this.log('CameraSource prepareStream', this.conf)

  const sessionInfo = {}

  sessionInfo.address = request.targetAddress

  const response = {}

  const currentAddress = ip.address()
  const addressResp = {
    address: currentAddress
  }

  if (ip.isV4Format(currentAddress)) {
    addressResp.type = 'v4'
  } else {
    addressResp.type = 'v6'
  }

  response.address = addressResp

  this.log('CameraSource prepareStream', response)

  callback(response)
}
CameraSource.prototype.handleCloseConnection = function (connectionID) {
  this.log('CameraSource handleCloseConnection', this.conf)
}
