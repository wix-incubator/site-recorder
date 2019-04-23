const fs = require('fs');
const gs = require('glob-stream');
const jimp = require('jimp');
const JPEGDecoder = require('jpg-stream/decoder');
const JPEGEncoder = require('jpg-stream/encoder');
const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');
const glob = require('glob');
const encoder = new GIFEncoder(854, 480);

module.exports = async (arg) => {
  // convert a PNG to a JPEG

  glob('tmp/**.jpeg', async (error, files) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    const promises = files.map(async file => {
      const f = await jimp.read(file)
      return await f.write(`tmp/${Math.random()}.png`)
    })
    await Promise.all(promises);
    pngFileStream('tmp/**.png')
      .pipe(encoder.createWriteStream({ repeat: -1, delay: 500, quality: 10 }))
      .pipe(fs.createWriteStream('myanimated.gif'));
  })
}
