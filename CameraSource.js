const fetch = require('node-fetch');

const ports = new Set();

function getPort() {
  for (let i = 5011;; i++) {
    if (!ports.has(i)) {
      ports.add(i);
      return i;
    }
  }
}

module.exports = class CameraSource {
    constructor(hap, conf, log, id, authToken) {
        this.hap = hap;
        this.conf = conf;
        this.log = log;
        this.id = id;
        this.authToken = authToken;
        this.services = [];
        this.streamControllers = [];

        const options = {
            proxy: false,
            disable_audio_proxy: false,
            srtp: false,
            video: {
                resolutions: [
                    [1920, 1080, 30],
                    [320, 240, 15],
                    [1280, 960, 30],
                    [1280, 720, 30],
                    [1024, 768, 30],
                    [640, 480, 30],
                    [640, 360, 30],
                    [480, 360, 30],
                    [480, 270, 30],
                    [320, 240, 30],
                    [320, 180, 30]
                ],
                codec: {
                    profiles: [0, 1, 2],
                    levels: [0, 1, 2] // Enum, please refer StreamController.VideoCodecParamLevelTypes
                }
            }
        };
        this._createStreamControllers(2, options);
    }
    handleSnapshotRequest(request, callback) {
        const log = this.log;
        log('CameraSource handleSnapshotRequest', this.conf);

        const myURL = `https://app.barnowl.tech/api/images/offset/?camera=${this.id}&offset=0`
        fetch(myURL, {
            headers: {
                Authorization: this.authToken,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                log('Got response from camera metadata', json.data);
                log('Fetching image data', json.data.url);
                return fetch(json.data.url);
            })
            .then((res) => {
                return res.arrayBuffer();
            })
            .then((buffer) => {
                callback(null, Buffer.from(buffer));
            });
    }
    createCameraControlService() {
        this.log('CameraSource createCameraControlService', this.conf);
        const controlService = new this.hap.Service.CameraControl();
        this.services.push(controlService);
    }
    handleStreamRequest(request) {
        this.log('CameraSource handleStreamRequest', this.conf);
        const myURL = `https://app.barnowl.tech/api/cameras/trigger/${this.id}`
        fetch(myURL, {
            headers: {
                Authorization: this.authToken,
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            this.log('Triggered a new snapshot')
        })
    }
    prepareStream(request, callback) {
        this.log('CameraSource prepareStream', this.conf);

        const video = request.video;
    
        const videoSrtpKey = video.srtp_key;
        const videoSrtpSalt = video.srtp_salt;
    
        const videoSSRC = this.hap.CameraController.generateSynchronisationSource();
    
        const localPort = getPort();
    
        const response = {
          video: {
            port: localPort,
            ssrc: videoSSRC,
    
            srtp_key: videoSrtpKey,
            srtp_salt: videoSrtpSalt,
          }
        };

        this.log('CameraSource prepareStream', response);

        callback(response);
    }
    handleCloseConnection(connectionID) {
        this.log('CameraSource handleCloseConnection', this.conf);
    }
    _createStreamControllers(maxStreams, options) {
        this.log('CameraSource _createStreamControllers', this.conf);

        let self = this;
        for (let i = 0; i < maxStreams; i += 1) {
            var streamController = new this.hap.StreamController(i, options, self);
            self.services.push(streamController.service);
            self.streamControllers.push(streamController);
        }
    }
}





