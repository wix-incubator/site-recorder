# site-recorder

[![Build Status](https://travis-ci.org/wix-incubator/site-recorder.svg?branch=master)](https://travis-ci.org/wix-incubator/site-recorder)

### Why
`site-recorder` is a CLI tool for creating comparable image/video artefact. You can pass url and get GIF animation or video loading passed website from the first network request till time to interactive. It's not possible to write real video with for ex. WebRTC, because in that case we have to wait when our script will be loaded. Instead, we are using `puppeteer` and generated `trace.json` to get screenshots which demonstrate how site is loading.

Example: [http://ronnyr34.wixsite.com/mysite-1](http://ronnyr34.wixsite.com/mysite-1)

![](example.gif)


### Example

```bash
npx site-recorder -gif https://google.com https://wix.com
```
The result is recorded video and gif-animation of loading passed url.

Custom script example:

```bash
npx site-recorder -gif --custom-script ../src/examples/long-wait-task.js
```
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
* [ffmpeg](https://ffmpeg.org/) installed
 (for mac os: `brew install ffmpeg`).
### Usage
```bash
Usage: site-recorder [options] <url1 ...> <url2 ...>
```

Options:


| Option | Description |
|--------------------------------------|---------------------------------------------------------------------------------------------|
| -v,--version | output the version number |
| -d,--debug | see full error messages, mostly for debugging |
| -gif,--generate-gif | generate gif as additional output |
| -W, --resolution-width [width] | define the resolution width in the screen recording |
| -H, --resolution-height [height] | define the resolution height in the screen recording |
| -D, --device [device] | define the device that will run the screen recording (Override resolution param |
| -N, --device [network] | define the throttler that will emulate network slowdown |
| -t,--timeout [navigation-timeout] | navigation timeout for loading event in puppeteer (default: 30000) |
| -cs, --custom-script [path-to-file] | add path to custom script that will execute once page is loaded (receives page as argument) |
| -bw, --disable-colors | minimize color and styling usage in output |
| -h,--help | output usage information |


### Using of artifacts

Both *output.mp4* and *output.gif* are extracted in the same folder as where command is executed. 

### Installation

Install the dependencies and devDependencies and start the server.

```sh
npm install
npm run example:gif # generates both gif and video
```

### Installing the tool as globally
```sh
npm install -g .
```

### Development

Want to contribute? Great!
Please take a look at opened [issues](https://github.com/wix-incubator/site-recorder/issues).

License
----

MIT
