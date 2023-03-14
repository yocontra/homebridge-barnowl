# homebridge-barnowl

**Homebridge plugin for displaying a BarnOwl as aCamera**

<!-- [![NPM version](https://badge.fury.io/js/homebridge-barnowl.svg)](https://npmjs.org/package/homebridge-barnowl) [![Dependency Status](https://christian-dm.org/yocontra/homebridge-barnowl.svg)](https://christian-dm.org/yocontra/homebridge-barnowl) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com) [![Downloads](https://img.shields.io/npm/dm/homebridge-barnowl.svg)](https://npmjs.org/package/homebridge-barnowl) -->

# Installation

Make sure you have homebridge installed.

1. Install this plugin using: `sudo npm install -g homebridge-barnowl`
2. Update your Homebridge `config.json` using the sample below (append in the block 'platforms' not 'accessories')

# Configuration

Update your config similar to this:

```json
 "platforms": [
      {
         "platform": "barnowl-camera",
         "images": [
            {
               "name": "Local Image",
               "path": "/path/to/image.jpg"
            },
            {
               "name": "Web Image",
               "url": "https://wwww.website.com/image.jpg"
            }
         ]
      }
   ]
```

**You can add multiple cameras!**

## Config file

Take a look at the <a href="config.example.json">example config.json</a>

Fields:

-   `name` name of the camera (required)
-   `path` the local path of an image (required)
-   `url` the web path of an image (optinal, overwrites `path`)

# Usage

In some cases, the camera is not visible in Home-App:

-   Press + on top right corner in Home-App
-   Press `Add device`
-   Press `Code missing`
-   Select Camera

Please note that the image will only be displayed as the camera preview. Image stream is not supported.
