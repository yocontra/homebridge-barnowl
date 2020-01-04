module.exports = function (homebridge) {
  homebridge.registerPlatform('homebridge-image-to-camera', 'image-camera', Platform, true)
  function Platform (log, config, api) {
    this.CameraAccessory = require('./CameraAccessory')(homebridge.hap, homebridge.platformAccessory, log)
    this.config = config || {}
    this.api = api
    this.log = log
    if (!api || api.version < 2.1) {
      throw new Error('Unexpected API version.')
    }
    api.on('didFinishLaunching', this.didFinishLaunching.bind(this))
  }

  Platform.prototype.configureAccessory = function (accessory) {
  }

  Platform.prototype.didFinishLaunching = function () {
    if (!this.config.images) {
      return this.log('no images configured', JSON.stringify(this.config))
    }

    const configuredAccessories = this.config.images.map(conf => new this.CameraAccessory(conf))
    this.log('configuredAccessories', configuredAccessories.length)
    this.api.publishCameraAccessories('image-camera', configuredAccessories)
  }
}
