# site-recorder

[![Build Status](https://travis-ci.org/wix-incubator/site-recorder.svg?branch=master)](https://travis-ci.org/wix-incubator/site-recorder)

### Why
`site-recorder` is a CLI tool for creating comparable image/video artefact. You can pass url and get GIF animation or video loading passed website from the first network request till time to interactive. It's not possible to write real video with for ex. WebRTC, because in that case we have to wait when our script will be loaded. Instead, we are using `puppeteer` and generated `trace.json` to get screenshots which demonstrate how site is loading.

Example: [http://ronnyr34.wixsite.com/mysite-1](http://ronnyr34.wixsite.com/mysite-1)

![](example.gif)

### Example

```bash
npm i site-recorder
site-recorder --generate-gif --generate-video https://google.com
ls -la | egrep "gif|mp4"
```

The result is recorded video and gif-animation of loading passed url.

### Tech

`site-recorder` uses a number of open source projects to work properly:

* [puppeteer](https://github.com/GoogleChrome/puppeteer) - Puppeteer is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.
* [Commander.js](https://github.com/tj/commander.js) - The complete solution for node.js command-line interfaces.
* [ffmpeg](https://ffmpeg.org/) - A complete, cross-platform solution to record, convert and stream audio and video.
* [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) - This library abstracts the complex command-line usage of ffmpeg into a fluent, easy to use node.js module.
* [gif-encoder](https://www.npmjs.com/package/gif-encoder) - Streaming GIF encoder

And of course `site-recorder` itself is open source with a [public repository](https://github.com/wix-incubator/site-recorder) on GitHub.

### Prerequisites

`site-recorder` requires:
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
