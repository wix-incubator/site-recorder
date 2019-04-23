const util = require('util');
const fs = require('fs');
const glob = require('glob');
const getPixels = require('get-pixels');
const GifEncoder = require('gif-encoder');

const gif = new GifEncoder(498, 374);
const file = fs.createWriteStream('mygif.gif');

gif.pipe(file);
gif.setQuality(1); // 1 for best quality colors
gif.setDelay(100);
gif.writeHeader();

const asyncGetPixels = util.promisify(getPixels);
const asyncGlob = util.promisify(glob);

async function addToGif(images, counter = 0) {
  try {
    const pixels = await asyncGetPixels(images[counter]);
    gif.addFrame(pixels.data);
    gif.read();

    if (counter === images.length - 1) {
      gif.finish();
    } else {
      await addToGif(images, ++counter);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * @param {string} globPattern - path where jpeg files is located
 */
async function jpegToGifConverter(globPattern) {
  try {
    const files = await asyncGlob(globPattern);
    await addToGif(files);
  } catch (error) {
    throw error;
  }
}

module.exports = jpegToGifConverter;
