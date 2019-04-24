# PROJECT_NAME

[![Build Status](https://travis-ci.org/wix-incubator/puppeteer-compare.svg?branch=master)](https://travis-ci.org/wix-incubator/puppeteer-compare)

PROJECT_NAME is a CLI tool for creating comparable image/video artefact.

### Tech

PROJECT_NAME uses a number of open source projects to work properly:

* [puppeteer](https://github.com/GoogleChrome/puppeteer) - Puppeteer is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.
* [Commander.js](https://github.com/tj/commander.js) - The complete solution for node.js command-line interfaces.
* [ffmpeg](https://ffmpeg.org/) - A complete, cross-platform solution to record, convert and stream audio and video.
* [videoshow](https://github.com/h2non/videoshow) - Simple node.js utility to create video slideshows from images with optional audio and visual effects using ffmpeg.
* [gif-encoder](https://www.npmjs.com/package/gif-encoder) - Streaming GIF encoder
    
And of course PROJECT_NAME itself is open source with a [public repository](https://github.com/wix-incubator/puppeteer-compare) on GitHub.

### Prerequisites 

PROJECT_NAME requires:
* [Node.js](https://nodejs.org/) v8+;
* [ffmpeg](https://ffmpeg.org/) installed (for mac os: `brew install ffmpeg`).

### Using of artifacts

Simple performance metrics are extracted by default.
 
To analyze in depth you can upload generated trace.json to Chrome Trace Viewer: `chrome://tracing/` (copy-paste this to the browser address bar).
You can read more about the "Trace Event Profiling Tool" [here](http://dev.chromium.org/developers/how-tos/trace-event-profiling-tool).

### Installation

Install the dependencies and devDependencies and start the server.

```sh
npm install
npm run example:full # generates both gif and video
```

### Development

Want to contribute? Great!

...


### Todos
- [ ] Write MORE Tests
- [ ] ...

License
----

MIT
