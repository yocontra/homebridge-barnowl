const packageJSON = require('./package.json')
const CameraSource = require('./CameraSource')

module.exports = (hap, Accessory, log) => class CameraAccessory extends Accessory {
    constructor(conf, authToken) {
        conf = conf || {}
        var name = conf.name || 'BarnOwl'
        if (!conf.id) return log('missing id in config', JSON.stringify(conf))
        var uuid = hap.uuid.generate('homebridge-barnowl:' + conf.id)

        super(name, uuid, hap.Accessory.Categories.CAMERA)
        log('setup camera accessory')

        this.getService(hap.Service.AccessoryInformation)
            .setCharacteristic(hap.Characteristic.Manufacturer, 'BarnOwl')
            .setCharacteristic(hap.Characteristic.Model, 'Camera')
            .setCharacteristic(hap.Characteristic.SerialNumber, conf.id)
            .setCharacteristic(hap.Characteristic.FirmwareRevision, packageJSON.version)

        this.on('identify', function (paired, callback) {
            log('identify')
            callback()
        })

        log('configure camera source')

        this.configureCameraSource(new CameraSource(hap, conf, log, conf.id, authToken))
    }
}
