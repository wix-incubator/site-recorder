const util = require('util');
const fs = require('fs');
const glob = require('glob');
const getPixels = require('get-pixels');
const GifEncoder = require('gif-encoder');

const gif = new GifEncoder(498, 374);
const file = fs.createWriteStream('mygif.gif');

gif.pipe(file);
gif.setQuality(10);
gif.writeHeader();

const asyncGetPixels = util.promisify(getPixels);

/**
 * @param {Object[]} files -Files pathes with time delay
 * @param {string} files[].fileName - path where jpeg files is located
 * @param {number} files[].timeDiffWithPrev - time for delay from previous frame in microseconds
 */
async function addToGif(files) {
  try {
    for(let i = 0; i < files.length; i++) {
      const pixels = await asyncGetPixels(files[i].fileName);
      gif.addFrame(pixels.data);
      gif.setDelay(files[i].timeDiffWithPrev / 1000 );
      gif.read();
    }
    gif.finish();
  } catch (error) {
    throw error;
  }
}

/**
 * @param {Object[]} files -Files pathes with time delay
 * @param {string} files[].fileName - path where jpeg files is located
 * @param {number} files[].timeDiffWithPrev - time for delay from previous frame in microseconds
 */
async function jpegToGifConverter(files) {
  try {
    await addToGif(files);
  } catch (error) {
    throw error;
  }
}

module.exports = jpegToGifConverter;
