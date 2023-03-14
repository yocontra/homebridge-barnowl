const CameraAccessory = require('./CameraAccessory')

module.exports = function (homebridge) {
  class Platform {
    constructor(log, config, api) {
      this.CameraAccessory = CameraAccessory(homebridge.hap, homebridge.platformAccessory, log)
      this.config = config || {}
      this.api = api
      this.log = log
      if (!api || api.version < 2.1) {
        throw new Error('Unexpected API version.')
      }
      api.on('didFinishLaunching', this.didFinishLaunching.bind(this))
    }
    configureAccessory(accessory) {
    }
    didFinishLaunching() {
      if (!this.config.cameras) {
        return this.log('no cameras configured', JSON.stringify(this.config))
      }

      const configuredAccessories = this.config.cameras.map(conf => new this.CameraAccessory(conf, this.config.authToken))
      this.log('configuredAccessories', configuredAccessories.length)
      this.api.publishCameraAccessories('homebridge-barnowl', configuredAccessories)
    }
  }

  homebridge.registerPlatform('homebridge-barnowl', 'BarnOwlCamera', Platform, true)
}
